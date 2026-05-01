import { useRef } from "react";
import type { ValidationErrors } from "./validate";

export default function ErrorPanel({ errors }: { errors: ValidationErrors }) {
  const pannelRef = useRef<HTMLDivElement>(null);
  const style = errors ? "h-7 flex" : "h-0 overflow-hidden";
  const errorArray =
    errors && Object.keys(errors).length > 0 ? Object.entries(errors) : [];
  const errorMessage = errorArray.length > 0 ? errorArray[0][1].message : "";
  return (
    <div
      ref={pannelRef}
      className={
        "justify-center items-center px-2 bg-bg text-red-error font-sans transition-all duration-200 mt-1 " +
        style
      }
    >
      {errorMessage}
    </div>
  );
}
