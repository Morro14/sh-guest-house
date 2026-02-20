import RequestAvailableRoomsContextProvider from "~/components/RequestAvailableRoomsContextProvider";
import type { Route } from "./+types/IndexRoute";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import Index from "./Index";
import BookingPannel from "~/components/index/BookingPanel";
import type { ValidationErrors } from "~/components/formComponents/validate";
import ErrorFallback from "~/components/ErrorFallback";
import { logError } from "~/utils/logging";
import { useRouteError } from "react-router";
import { useEffect } from "react";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  console.log("error router boundary", error);
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
  console.log("form data:", formData);
  console.log("form strings", formDataObj);
  const params = new URLSearchParams(formDataObj);
  return redirect(`booking?${params}`);
}

export default function IndexRoute({ actionData }: Route.ComponentProps) {
  const errors = actionData;
  return (
    <div className="flex flex-col min-h-screen min-w-screen text-text-main">
      <RequestAvailableRoomsContextProvider params={{ errors: errors }}>
        <BookingPannel></BookingPannel>
      </RequestAvailableRoomsContextProvider>
      <Index></Index>
    </div>
  );
}
