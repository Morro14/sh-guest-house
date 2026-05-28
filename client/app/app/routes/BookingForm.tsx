import { Form, useFetcher, useNavigation } from "react-router";
import { useIndexBookingContextProvider } from "../components/booking/IndexBookingContextProvider.tsx";
import SelectGuests from "../components/formComponents/SelectGuests";
import { useTranslation } from "react-i18next";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import type { Route } from "./+types/BookingForm";
import { getLanguagePathParam, getUrlSearchParams } from "~/utils/general";
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
import { FormChangeLayout } from "~/components/formComponents/SelectGuestsLayouts.tsx";
import ErrorPanel from "~/components/formComponents/ErrorPanel.tsx";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  return <ErrorFallback />;
}
export async function clientAction({ request }: Route.ClientActionArgs) {
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
  const params = new URLSearchParams(formDataObj);
  return redirect(`/${getLanguagePathParam()}/booking?${params}`);
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
  const navigation = useNavigation();
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
            className="font-medium text-gray-warm-mid"
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
                  InputProps: {
                    disableUnderline: false,
                  },
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

        <div className="flex flex-col items-center md:gap-3 gap-2 border-b border-b-line-light">
          <label
            className="font-medium text-gray-warm-mid"
            htmlFor="checkin-date-input"
          >
            {t("Guests")}
          </label>
          <SelectGuests
            layout={FormChangeLayout}
            defaultParams={{
              adults: searchParams.adults,
              children: searchParams.children,
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <label
            className="font-medium text-gray-warm-mid"
            htmlFor="checkin-date-input"
          >
            {t("Nights")}
          </label>
          <div className="flex h-full w-[132px] justify-center items-center">
            <input
              className={`h-[26px] text-center font-medium w-6 placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 ${actionData?.nights ? "border-red-error" : "border-line-light"} `}
              name="nights"
              defaultValue={Number(searchParams.nights)}
              type="text"
              maxLength={2}
              onChange={(e) => context.setNightsCount(Number(e.target.value))}
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
