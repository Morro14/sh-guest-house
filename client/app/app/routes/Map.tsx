import { useState } from "react";
import { useTranslation } from "react-i18next";
import Map from "~/components/index/map/Map";
import MapContextProvider from "~/components/index/map/MapContextProvider";
import openMapPic from "src/assets/open-map-pic.svg";
import { NavLink, useLocation, useNavigation } from "react-router";
import LangSelect from "~/components/LangSelect";

export default function MapPage() {
  const { t } = useTranslation();
  const loc = useLocation();
  const lang = loc.pathname.split("/")[1];
  const nav = useNavigation();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <header className="flex w-full xl:px-5 md:px-4 px-2 py-1">
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
        <div className="w-1/3 flex justify-end">
          <LangSelect></LangSelect>
        </div>
      </header>
      <div
        className={`h-0.5 w-full ${nav.state !== "idle" ? "gradient-line" : "bg-primary"}`}
      ></div>
      <div id="map-console" className="text-left w-full pl-2"></div>
      <div className="flex flex-col items-center w-full h-full">
        <MapContextProvider>
          <Map></Map>
        </MapContextProvider>
      </div>
    </div>
  );
}
