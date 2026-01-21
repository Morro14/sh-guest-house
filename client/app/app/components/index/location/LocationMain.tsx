import { Link } from "react-router";
import mapImg from "root/src/assets/map.png";
import googleMapsIcon from "root/src/assets/google-map-icon.svg";
import { useTranslation } from "react-i18next";

export default function LocationMain() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end col-span-2 font-sans gap-5 font-medium text-lg">
        <Link to="" className="flex gap-2 underline">
          <img className="w-4" src={googleMapsIcon} />
          <div>Open in Google Maps</div>
        </Link>
        <Link to="" className="underline">
          Open a written guide
        </Link>
        <Link to="" className="underline">
          Shuttle from Yeghegnadzor
        </Link>
      </div>
    </div>
  );
}
