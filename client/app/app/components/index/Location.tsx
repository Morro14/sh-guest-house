import { Link } from "react-router";
import googleMapsIcon from "root/src/assets/google-map-icon.svg";
import { useTranslation } from "react-i18next";

export default function LocationMain() {
  const { t } = useTranslation();
  return (
    <div className="flex md:flex-row flex-col items-center md:justify-center col-span-2 font-sans md:gap-5 gap-2 text">
      <Link to="" className="flex gap-2 underline">
        <img className="w-3" src={googleMapsIcon} />
        <div>{t("Open in Google Maps")}</div>
      </Link>
      <Link to="" className="underline">
        {t("Open a written guide")}
      </Link>
      <Link to="" className="underline">
        {t("Shuttle from Yeghegnadzor")}
      </Link>
    </div>
  );
}
