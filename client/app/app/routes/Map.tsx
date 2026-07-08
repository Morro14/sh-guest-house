import { useTranslation } from "react-i18next";
import Map from "~/components/index/map/Map";
import MapContextProvider from "~/components/index/map/MapContextProvider";
import { NavLink, useLocation, useNavigation } from "react-router";
import LangSelect from "~/components/LangSelect";
import { MAP_OPTIONS } from "~/components/index/map/utils";
import BurgerMenu from "~/components/BurgerMenu";
import { useRef } from "react";

export default function MapPage() {
  const { t } = useTranslation();
  const loc = useLocation();
  const lang = loc.pathname.split("/")[1];
  const nav = useNavigation();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <header className="flex w-full xl:px-5 md:px-4 px-2 py-1 h-10">
        <div className="w-1/3">
          <NavLink className="relative top-0.5 font-medium" to={`/${lang}`}>
            {t("To main page")}
          </NavLink>
        </div>
        <div className="w-1/3 flex justify-center ">
          <h5 className="hidden md:block">
            {t("Points of interest in Vayots Dzor")}
          </h5>
        </div>
        <div className="w-1/3 flex justify-end gap-4">
          <LangSelect></LangSelect>
          <BurgerMenu dialogRef={dialogRef}></BurgerMenu>
        </div>
      </header>
      <div
        className={`h-0.5 w-full ${nav.state !== "idle" ? "gradient-line" : "bg-primary"}`}
      ></div>
      <div id="map-console" className="text-left w-full pl-2"></div>
      <div className="flex flex-col items-center w-full h-full">
        <MapContextProvider>
          <Map options={MAP_OPTIONS}></Map>
        </MapContextProvider>
      </div>
    </div>
  );
}
