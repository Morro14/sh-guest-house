import { useIndexBookingContextProvider } from "../booking/IndexBookingContextProvider";
import { useRef } from "react";
import type { ValidationErrors } from "./validate";

export default function ErrorPanelMobile() {
  const pannelRef = useRef<HTMLDivElement>(null);
  const context = useIndexBookingContextProvider();
  const errors: ValidationErrors = context.errors;
  const errorsExist = errors && Object.keys(errors).length > 0;
  const style = errorsExist ? "h-7 flex" : "h-0 overflow-hidden";
  const errorArray = errorsExist ? Object.entries(errors) : [];
  const errorMessage = errorsExist ? errorArray[0][1].message : "";
  return (
    <div
      ref={pannelRef}
      className={
        "absolute justify-center items-center w-full italic bg-red-bg-error-light font-sans transition-all duration-200 mt-1 " +
        style
      }
    >
      {errorMessage}
    </div>
  );
}
