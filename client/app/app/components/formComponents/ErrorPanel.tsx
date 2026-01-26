import { useContextProvider } from "../ContextProvider";
import { useRef } from "react";
import type { ValidationErrors } from "./validate";

export default function ErrorPanel() {
  const pannelRef = useRef<HTMLDivElement>(null);
  const context = useContextProvider();
  const errors: ValidationErrors = context.errors;

  const errorsExist = context.errorState && context.errorState.length > 0;
  const style = errorsExist ? "h-7 flex" : "h-0 overflow-hidden";
  const errorMessage = errorsExist ? context.errorState[0] : "";
  return errors && Object.keys(errors).length > 0 ? (
    <div
      ref={pannelRef}
      className={
        "absolute justify-center items-center w-full italic bg-red-bg-error-light font-sans transition-all duration-200 " +
        style
      }
    >
      {errorMessage.message}
    </div>
  ) : (
    ""
  );
}
