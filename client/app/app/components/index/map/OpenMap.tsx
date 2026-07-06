import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router";
import openMapPic from "src/assets/open-map-pic.svg";

export default function OpenMap() {
  const { t } = useTranslation();
  const loc = useLocation();
  const lang = loc.pathname.split("/")[1];
  return (
    <div className="flex justify-center items-center w-60 h-60 border border-gray-300 sm:hidden">
      <NavLink
        to={`/:lang/map`}
        className="underline font-serif font-bold text-lg px-2 py-2 bg-bg z-10"
      >
        {t("Open map")}
      </NavLink>
      <img src={openMapPic} className="absolute " />
    </div>
  );
}
