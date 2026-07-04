import { useTranslation } from "react-i18next";
import { useMapContextProvider } from "./MapContextProvider";
import { MAP_OPTIONS } from "./utils";
import { zoomMap } from "./zoom";

export default function MapZoomModal() {
  const { t } = useTranslation();
  const context = useMapContextProvider();
  const { mapContainer, mapSurface, mapContent } = context.mapElements;
  console.log("elements", mapSurface);
  const currentZoom = context.zoom;
  const zoomFactor = MAP_OPTIONS.zoomFactor;
  const zoomFormatted = `${Math.floor(currentZoom * 100)}%`;
  return (
    <div className="absolute md:top-4 top-2 md:right-4 right-2 flex flex-col gap-2 items-center z-25 font-sans bg-transparent backdrop-blur min-w-20">
      <div>
        <div>{t("Zoom")}</div>
        <div>{zoomFormatted}</div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <button
          className="bg-bg flex justify-center items-center rounded drop-shadow md:w-8 w-10 md:h-8 h-10"
          onClick={() => {
            const zoomNew = currentZoom - zoomFactor;
            if (zoomNew < MAP_OPTIONS.zoomMin) {
              return;
            }
            zoomMap({
              mapContainer,
              mapSurface,
              mapContent,
              zoomNew,
            });
            context.setZoom(zoomNew);
          }}
        >
          {minusSVG}
        </button>
        <button
          className="bg-bg flex justify-center items-center rounded drop-shadow md:w-8 w-10 md:h-8 h-10"
          onClick={() => {
            const zoomNew = currentZoom + zoomFactor;
            if (zoomNew > MAP_OPTIONS.zoomMax) {
              return;
            }
            zoomMap({
              mapContainer,
              mapSurface,
              mapContent,
              zoomNew,
            });
            context.setZoom(zoomNew);
          }}
        >
          {plusSVG}
        </button>
      </div>
    </div>
  );
}

const minusSVG = (
  <svg
    width="23"
    height="1"
    viewBox="0 0 23 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="0.5" x2="22.1739" y2="0.5" stroke="#4c3b33" />
  </svg>
);

const plusSVG = (
  <svg
    width="23"
    height="23"
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="10.9348"
      y1="2.18557e-08"
      x2="10.9348"
      y2="22.1739"
      stroke="black"
    />
    <line y1="11.239" x2="22.1739" y2="11.239" stroke="#4c3b33" />
  </svg>
);
