import { useTranslation } from "react-i18next";
import { useMapContextProvider } from "./MapContextProvider";
import { MAP_OPTIONS, MAP_SIZE_INIT } from "./utils";
import { zoomMap } from "./zoom";

export default function MapZoomModal() {
  const { t } = useTranslation();
  const context = useMapContextProvider();
  const { mapContainer, mapSurface, mapContent } = context.mapElements;
  const currentZoom = context.zoom;
  const zoomFactor = MAP_OPTIONS.zoomFactor;
  const zoomFormatted = `${Math.floor(currentZoom * 100)}%`;
  return (
    <div className="absolute md:top-4 top-2 md:right-4 right-2 flex flex-col gap-2 items-center z-25 font-sans p-2 rounded-lg">
      <div className="text-center map-text-shadow">
        <div>{t("Zoom")}</div>
        <div>{zoomFormatted}</div>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <button
          className="bg-bg flex justify-center items-center rounded-lg drop-shadow md:w-8 w-10 md:h-8 h-10"
          onClick={() => {
            const zoomNew = currentZoom - zoomFactor;
            if (zoomNew < MAP_OPTIONS.zoomMin) {
              return;
            }
            const anchorDefault = {
              x: mapContainer.clientWidth / 2,
              y: mapContainer.clientHeight / 2,
            };
            const anchorRatio = {
              x:
                (mapContainer.clientWidth / 2 - mapSurface.offsetLeft) /
                (MAP_SIZE_INIT.x * currentZoom),
              y:
                (mapContainer.clientHeight / 2 - mapSurface.offsetTop) /
                (MAP_SIZE_INIT.y * currentZoom),
            };
            zoomMap({
              mapContainer,
              mapSurface,
              mapContent,
              zoomNew,
              anchorRatio: anchorRatio,
              anchor: anchorDefault,
              zoomCurrent: currentZoom,
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
            const anchorDefault = {
              x: mapContainer.clientWidth / 2,
              y: mapContainer.clientHeight / 2,
            };
            const anchorRatio = {
              x:
                (mapContainer.clientWidth / 2 - mapSurface.offsetLeft) /
                (MAP_SIZE_INIT.x * currentZoom),
              y:
                (mapContainer.clientHeight / 2 - mapSurface.offsetTop) /
                (MAP_SIZE_INIT.y * currentZoom),
            };
            zoomMap({
              mapContainer,
              mapSurface,
              mapContent,
              zoomNew,
              anchorRatio: anchorRatio,
              anchor: anchorDefault,
              zoomCurrent: currentZoom,
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
    height="2"
    viewBox="0 0 23 2"
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
