import { Form } from "react-router";
import { useContextProvider } from "../components/RequestAvailableRoomsContextProvider";
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
  const context = useContextProvider();
  const today = dayjs();
  const [date, setDate] = useState(today);
  const { t } = useTranslation();
  const searchParams = getUrlSearchParams([
    "date",
    "adults",
    "children",
    "nights",
  ]);
  useEffect(() => {
    if (actionData && Object.keys(actionData).length > 0) {
      context.setErrorState(actionData);
    }
  }, [actionData, context]);
  return (
    <Form
      method="post"
      className="relative flex flex-col gap-3 items-center size-full"
    >
      <div className="flex justify-between w-full items-center overflow-visible font-sans">
        <div className="flex flex-col items-center gap-3">
          <label className="font-light" htmlFor="checkin-date-input">
            {t("Check-in date") + ":"}
          </label>
          <div className="h-[25px] border-b w-[132px] border-line-light">
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
                    disableUnderline: true,
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

        <div className="flex flex-col items-center gap-3 border-b border-b-line-light">
          <label className="font-light" htmlFor="checkin-date-input">
            {t("Check-in date") + ":"}
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
          <label className="font-light" htmlFor="checkin-date-input">
            {t("Check-in date") + ":"}
          </label>
          <div className="flex h-full w-[132px] justify-center items-center">
            <input
              className="text-center font-medium w-6 placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 border-line-light"
              name="nights"
              defaultValue={Number(searchParams.nights)}
              type="text"
              maxLength={2}
              onChange={(e) => context.setNightsCount(Number(e.target.value))}
            />
            <div className="w-[25px] ml-2">
              {t("nights", { count: context.nightsCount })}
            </div>
          </div>
        </div>
      </div>
      {context.errorState ? (
        <div className="absolute top-[106px]">
          <ErrorPanel></ErrorPanel>
        </div>
      ) : (
        ""
      )}
      <button
        type="submit"
        className="px-3 bg-peach rounded-sm text-white font-medium font-sans mt-2 cursor-pointer "
      >
        {t("Show available rooms")}
      </button>
    </Form>
  );
}
