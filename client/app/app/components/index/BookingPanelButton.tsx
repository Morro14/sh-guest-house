import Dots from "../status/Dots";

export default function BookingPanelButton({
  label,
  state,
  containerProps = "",
  buttonProps = "",
  spinner = Dots(),
}: {
  label: string;
  state: "idle" | "submitting" | "loading";
  containerProps?: string;
  buttonProps?: string;
  spinner?: React.JSX.Element;
}) {
  return (
    <div
      className={`relative flex items-center ${state === "idle" ? "justify-start" : "justify-center"} ${containerProps} overflow-x-visible`}
    >
      <button
        type="submit"
        className={`capitalize hover:text-accent cursor-pointer font-medium text-left underline text-nowrap ${state !== "idle" ? "opacity-0 hidden" : "opacity-100 block"} 
          "hidden" : ""}`}
      >
        {label}
      </button>
      {state !== "idle" ? spinner : ""}
    </div>
  );
}
