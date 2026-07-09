import { useFetcher } from "react-router";
import { useIndexBookingContextProvider } from "../components/booking/IndexBookingContextProvider.tsx";
import { useTranslation } from "react-i18next";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import type { Route } from "./+types/BookingForm";
import { getUrlSearchParams } from "~/utils/general";
import { useEffect, useState } from "react";
import type { ValidationErrors } from "~/components/formComponents/validate";
import type { BookingForm } from "./IndexRoute";
import { formDataToObject } from "./IndexRoute";
import ErrorFallback from "~/components/ErrorFallback";
import { logError } from "~/utils/logging";
import { useRouteError } from "react-router";
import { DatePicker } from "@mui/x-date-pickers";
import { desktopDatePickerSx } from "../components/formComponents/mui.tsx";
import dayjs from "dayjs";
import ErrorPanel from "~/components/formComponents/ErrorPanel.tsx";
import { genGuestOptions } from "~/components/formComponents/utils.tsx";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  return <ErrorFallback />;
}
export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  // test spinner
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const formData = await request.formData();
  const formDataObject = formDataToObject(formData);
  const errors: ValidationErrors = validate(formDataObject);
  if (Object.keys(errors).length > 0) {
    return errors;
  }
  const formDataObj = {};
  for (const [k, v] of formData.entries()) {
    formDataObj[k] = v.toString();
  }
  const paramsNew = new URLSearchParams(formDataObj);
  return redirect(`/${params.lang}/booking?${paramsNew}`);
}

export default function BookingForm({ actionData }: Route.ComponentProps) {
  const context = useIndexBookingContextProvider();
  const today = dayjs();
  const [date, setDate] = useState(today);
  const { t } = useTranslation();
  const searchParams = getUrlSearchParams([
    "date",
    "adults",
    "children",
    "nights",
  ]);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";
  return (
    <fetcher.Form
      method="post"
      className="relative flex flex-col gap-5 items-center"
    >
      <div className="flex md:flex-row flex-col md:justify-between max-md:gap-5 w-full items-center overflow-visible font-sans">
        <div className="flex flex-col items-center md:gap-3 gap-2">
          <label
            className="text-gray-warm-mid text-sm"
            htmlFor="checkin-date-input"
          >
            {t("Check-in date")}
          </label>
          <div className="w-33">
            <DatePicker
              maxDate={today.set("year", today.get("year") + 1)}
              defaultValue={today}
              value={date}
              onChange={(date) => setDate(date)}
              disablePast
              slotProps={{
                textField: {
                  fullWidth: false,
                  variant: "standard",
                  size: "small",
                  endAdornment: false,
                  // InputProps: {
                  //   disableUnderline: false,
                  // },
                  sx: desktopDatePickerSx,
                },
              }}
            ></DatePicker>
            <input
              className="hidden"
              readOnly
              value={date.format().slice(0, 10)}
              id="checkin-date-input"
              name="date"
            />
          </div>
        </div>

        <fieldset className="flex flex-col items-center md:gap-3 gap-3">
          <legend className="hidden  text-gray-warm-mid text-sm">
            {t("Guests")}
          </legend>
          <div className="flex p-4 bg-bg gap-4 h-full">
            <div className="flex flex-col items-center md:gap-3 gap-2">
              <label className="text-sm" htmlFor="select-adults">
                {t("adults", { context: "genetive" })}
              </label>
              <select
                id="select-adults"
                defaultValue={Number(searchParams.adults)}
                className="guest-input border-b border-line-light px-2 bg-bg"
                name="adults"
              >
                {genGuestOptions(12, "adults")}
              </select>
            </div>
            <div className="flex flex-col items-center md:gap-3 gap-2">
              <label className="text-sm" htmlFor="select-children">
                {t("children", { context: "genetive" })}
              </label>
              <select
                id="select-children"
                defaultValue={Number(searchParams.children)}
                className="guest-input border-b border-line-light px-2 bg-bg"
                name="children"
              >
                {genGuestOptions(12, "children")}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="flex flex-col items-center gap-3">
          <label className="text-gray-warm-mid text-sm" htmlFor="nights-input">
            {t("Nights")}
          </label>
          <div className="flex h-full w-[132px] justify-center items-center">
            <input
              className={`text-center font-medium w-9 placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 ${actionData?.nights ? "border-red-error" : "border-line-light"} `}
              name="nights"
              defaultValue={Number(searchParams.nights)}
              type="number"
              maxLength={2}
              onChange={(e) => context.setNightsCount(Number(e.target.value))}
              id="nights-input"
            />
          </div>
        </div>
      </div>
      <div className="h-8">
        <button
          type="submit"
          className="text-text-main transition-colors duration-150 underline font-source-sans text-lg cursor-pointer "
        >
          {isSubmitting ? t("loading...") : t("Show available rooms")}
        </button>

        {context.errors ? (
          <div className="my-2">
            <ErrorPanel errors={actionData}></ErrorPanel>
          </div>
        ) : (
          ""
        )}
      </div>
    </fetcher.Form>
  );
}
