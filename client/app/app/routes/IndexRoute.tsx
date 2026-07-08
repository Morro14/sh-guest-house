import IndexBookingContextProvider from "~/components/booking/IndexBookingContextProvider";
import type { Route } from "./+types/IndexRoute";
import { validate } from "~/components/formComponents/validate";
import { redirect, useNavigation } from "react-router";
import Index from "./Index";
import BookingPannel from "~/components/index/BookingPanel";
import type { ValidationErrors } from "~/components/formComponents/validate";
import ErrorFallback from "~/components/ErrorFallback";
import { logError } from "~/utils/logging";
import { useRouteError } from "react-router";
import { useEffect } from "react";
import BookingPannelMobile from "~/components/index/BookingPanelMobile";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  return <ErrorFallback />;
}

export function formDataToObject<T extends Record<keyof BookingForm, string>>(
  formData: FormData,
): T {
  return Object.fromEntries(formData.entries()) as T;
}
export interface BookingForm {
  adults: string;
  children: string;
  nights: string;
  date: string;
}
export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  // test spinner
  // await new Promise((resolve) => setTimeout(resolve, 3000));

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
  const lang = params.lang;
  const paramsNew = new URLSearchParams(formDataObj);

  return redirect(`/${lang}/booking?${paramsNew}`);
}

export default function IndexRoute({ actionData }: Route.ComponentProps) {
  const errors = actionData;
  const nav = useNavigation();
  return (
    <div className="flex flex-col min-h-screen min-w-screen text-text-main relative">
      <IndexBookingContextProvider params={{ errors: errors }}>
        <div
          className={`sticky top-0 z-31 h-0.5 w-full ${nav.state !== "idle" ? "gradient-line" : "bg-primary"}`}
        ></div>
        <BookingPannel></BookingPannel>
        <BookingPannelMobile></BookingPannelMobile>
        <Index></Index>
      </IndexBookingContextProvider>
    </div>
  );
}
