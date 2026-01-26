import Header from "~/components/Header";
import ContextProvider from "~/components/ContextProvider";
import type { Route } from "./+types/Main";
import { validate } from "~/components/formComponents/validate";
import { redirect } from "react-router";
import Index from "./Index";
import BookingPannel from "~/components/BookingPanel";
import type { ValidationErrors } from "~/components/formComponents/validate";

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
        <Header bookingPannelEnabled={false}></Header>
        <BookingPannel></BookingPannel>
        <Index></Index>
      </ContextProvider>
    </div>
  );
}
