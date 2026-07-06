import { useState } from "react";
import { useTranslation } from "react-i18next";
import Map from "~/components/index/map/Map";
import MapContextProvider from "~/components/index/map/MapContextProvider";
import openMapPic from "src/assets/open-map-pic.svg";

export default function MapPage() {
  const { t } = useTranslation();
  const [mapFullView, setMapFullView] = useState(false);
  return (
    <div className="w-screen flex justify-center">
      <div className="index-container-1 flex flex-col items-center">
        <div
          id="points-of-interest"
          className="flex flex-col gap-6 relative scroll-mt-15 my-8"
        >
          <div>
            <h2 className="text-center">{t("Vayots Dzor")}</h2>
            <h3 className="text-center -mt-6">
              {t("Points of interest in the province")}
            </h3>
          </div>
        </div>
        {!mapFullView ? (
          <div className="flex justify-center items-center w-[238px] h-[238px] border border-gray-300">
            <button className="underline font-serif font-bold text-lg px-2 py-2 bg-bg z-10">
              {t("Open map")}
            </button>
            <img src={openMapPic} className="absolute " />
          </div>
        ) : (
          <MapContextProvider>
            <Map></Map>
          </MapContextProvider>
        )}
      </div>
    </div>
  );
}
