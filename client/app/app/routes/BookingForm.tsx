import { Form } from "react-router";
import { useContextProvider } from "../components/ContextProvider";
import SelectGuests from "../components/formComponents/SelectGuests";
import { useTranslation } from "react-i18next";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import type { Route } from "./+types/BookingForm";
import { getUrlSearchParams } from "~/utils/general";
import { useEffect } from "react";
import type { ValidationErrors } from "~/components/formComponents/validate";
import type { BookingForm } from "./Main";
import { formDataToObject } from "./Main";

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
  return redirect(`/booking?${params}`);
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
            date: date,
            nights: nights,
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
      {/* <div className="flex justify-between items-center"> */}
      {/* <div>{arrow}</div> */}
      <button
        type="submit"
        className="px-3 text-lg font-medium bg-peach rounded font-sans text-bg mt-2 cursor-pointer hover:bg-peach-accent"
      >
        {t("Show available rooms")}
      </button>
      {/* <div className="rotate-180">{arrow}</div> */}
      {/* </div> */}
    </Form>
  );
}

const arrow = (
  <svg
    width="20"
    height="23"
    viewBox="0 0 20 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 1C12.3878 9.01316 6.5102 11.5 1 11.5"
      stroke="#EFA76A"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M19 22C12.3878 13.9868 6.5102 11.5 1 11.5"
      stroke="#EFA76A"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);
