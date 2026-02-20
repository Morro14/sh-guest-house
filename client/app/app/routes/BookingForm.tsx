import { Form } from "react-router";
import { useContextProvider } from "../components/RequestAvailableRoomsContextProvider";
import SelectGuests from "../components/formComponents/SelectGuests";
import { useTranslation } from "react-i18next";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import type { Route } from "./+types/BookingForm";
import { getLanguagePathParam, getUrlSearchParams } from "~/utils/general";
import { useEffect } from "react";
import type { ValidationErrors } from "~/components/formComponents/validate";
import type { BookingForm } from "./IndexRoute";
import { formDataToObject } from "./IndexRoute";

import ErrorFallback from "~/components/ErrorFallback";
import { logError } from "~/utils/logging";
import { useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  console.log("error router boundary", error);
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
  const url = new URL(request.url);
  return redirect(`/${getLanguagePathParam(url.pathname)}/booking?${params}`);
}

export default function BookingForm({ actionData }: Route.ComponentProps) {
  const context = useContextProvider();
  const { t } = useTranslation();
  const { date, nights, adults, children } = getUrlSearchParams([
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
    <Form method="post" className="flex flex-col gap-3 items-center size-full">
      <div className="flex justify-between w-full items-center overflow-visible">
        <div className="h-[25px] border-b w-[132px] border-b-line-light">
          <input
            defaultValue={date}
            id="date-picker"
            name="date"
            type="date"
            placeholder="Date"
          />
        </div>

        <SelectGuests
          defaultParams={{
            adults: adults,
            children,
          }}
        />

        <div className="flex h-10 w-[132px] justify-center items-center hover:bg-peach-lighter">
          <input
            className="text-center font-medium w-12 placeholder:text-center placeholder:text-[#4c3b3350] placeholder:italic focus:placeholder:text-gray-400 border-b-1 border-line-light"
            name="nights"
            defaultValue={Number(nights)}
            type="text"
            maxLength={2}
            onChange={(e) => context.setNightsCount(Number(e.target.value))}
          />
          <div className="w-[25px] ml-2">
            {t("nights", { count: context.nightsCount })}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="px-3 text-lg font-medium bg-peach rounded font-sans text-bg mt-2 cursor-pointer hover:bg-peach-accent"
      >
        {t("Show available rooms")}
      </button>
    </Form>
  );
}
