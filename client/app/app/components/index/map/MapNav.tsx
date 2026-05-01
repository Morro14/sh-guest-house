import { useTranslation } from "react-i18next";
import { useMapContextProvider } from "./MapContextProvider";
import {
  getMapCenteredOffsets,
  MAP_SIZE_INIT,
  type Size,
  type ZoomState,
} from "./utils";

export default function MapNav({
  map,
  container,
}: {
  map: HTMLDivElement;
  container: HTMLDivElement;
}) {
  const { t } = useTranslation();
  const context = useMapContextProvider();
  const currentZoom = context.zoom;
  const setMapZoomed = (offsets: Size, zoom: number) => {
    map.style.left = `${offsets.x}px`;
    map.style.top = `${offsets.y}px`;
    map.style.width = `${MAP_SIZE_INIT.x * zoom}px`;
    map.style.height = `${MAP_SIZE_INIT.y * zoom}px`;
    map.style.scale = `${zoom}`;
  };
  return (
    <div className="">
      <div className="space-x-8">
        <button
          onClick={() => {
            if (context.zoom > 2) {
              return;
            }
            const newZoom = currentZoom + 0.2;
            const state: ZoomState = {
              mapOffsets: { x: map.offsetLeft, y: map.offsetTop },
              containerSize: {
                x: container.clientWidth,
                y: container.clientHeight,
              },
              zoomCurrent: currentZoom,
              zoomNew: newZoom,
            };
            const centeredOffsets = getMapCenteredOffsets(state);
            setMapZoomed(centeredOffsets, newZoom);
            context.setZoom(newZoom);
          }}
        >
          {t("zoom in")}
        </button>
        <button
          onClick={() => {
            if (context.zoom <= 1) {
              return;
            }
            const newZoom = currentZoom - 0.2;
            const state: ZoomState = {
              mapOffsets: { x: map.offsetLeft, y: map.offsetTop },
              containerSize: {
                x: container.clientWidth,
                y: container.clientHeight,
              },
              zoomCurrent: currentZoom,
              zoomNew: newZoom,
            };
            const centeredOffsets = getMapCenteredOffsets(state);
            setMapZoomed(centeredOffsets, newZoom);
            context.setZoom(newZoom);
          }}
        >
          {t("zoom out")}
        </button>
      </div>
    </div>
  );
}
