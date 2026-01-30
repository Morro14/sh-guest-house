import ContextProvider from "~/components/ContextProvider";
import type { Route } from "./+types/Main";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import Index from "./Index";
import BookingPannel from "~/components/BookingPanel";
import type { ValidationErrors } from "~/components/formComponents/validate";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
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

export default function Main({ actionData }: Route.ComponentProps) {
  const errors = actionData;
  return (
    <div className="flex flex-col min-h-screen min-w-screen text-text-main">
      <ContextProvider params={{ errors: errors }}>
        <BookingPannel></BookingPannel>
        <Index></Index>
      </ContextProvider>
    </div>
  );
}
