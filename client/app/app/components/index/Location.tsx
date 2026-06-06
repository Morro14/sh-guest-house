import googleMapsIcon from "root/src/assets/google-map-icon.svg";
import { useTranslation } from "react-i18next";

export default function LocationMain() {
  const { t } = useTranslation();
  return (
    <div className="flex md:flex-row flex-col items-center md:justify-center col-span-2 font-sans md:gap-5 gap-2 text">
      <a
        href="https://maps.app.goo.gl/48eyX1Yuqn6haWYZ8"
        className="flex gap-2 underline hover:cursor-pointer"
      >
        <img className="w-3" src={googleMapsIcon} />
        <div>{t("Open in Google Maps")}</div>
      </a>
      <span
        className="underline text-gray-warm-inactive pointer-events-none hover:cursor-pointer"
        aria-disabled
      >
        {t("Open a written guide")}
      </span>
      <span
        className="underline text-gray-warm-inactive pointer-events-none hover:cursor-pointer"
        aria-disabled
      >
        {t("Shuttle from Yeghegnadzor")}
      </span>
    </div>
  );
}
