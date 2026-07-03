import { useTranslation } from "react-i18next";
import Map from "~/components/index/map/Map";
import MapContextProvider from "~/components/index/map/MapContextProvider";

export default function MapPage() {
  const { t } = useTranslation();
  return (
    <div className="w-screen flex justify-center">
      <div className="index-container-1">
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
        <MapContextProvider>
          <Map></Map>
        </MapContextProvider>
      </div>
    </div>
  );
}
