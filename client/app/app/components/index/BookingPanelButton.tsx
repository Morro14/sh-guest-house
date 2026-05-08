import { useTranslation } from "react-i18next";
import Dots from "../status/Dots";
import Spinner from "../status/Spinner";

export default function BookingPanelButton({
  label,
  state,
  containerProps = "",
  buttonProps = "",
}: {
  label: string;
  state: "idle" | "submitting" | "loading";
  containerProps?: string;
  buttonProps?: string;
}) {
  const { t } = useTranslation();
  return (
    <div
      className={`relative flex items-center justify-center ${containerProps} overflow-x-visible`}
    >
      <button
        type="submit"
        className={`capitalize absolute left-7 hover:text-accent cursor-pointer underline font-medium text-left text-nowrap ${state !== "idle" ? "opacity-0 hidden" : "opacity-100 block"} 
          transition-all transition-discrete duration-150 ${buttonProps}`}
      >
        {label}
      </button>
      <div
        className={`text-gray-warm-mid transition-all duration-150 absolute left-7 gap-4 items-center starting:opacity-0 
          ${state === "idle" ? "hidden " : "flex opacity-100"}`}
      >
        <span>{t("Loading")}</span>
        <span>
          <Spinner variation="grayMid" size={16}></Spinner>
        </span>
      </div>
    </div>
  );
}
