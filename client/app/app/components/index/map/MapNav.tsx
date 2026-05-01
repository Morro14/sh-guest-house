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
  const zoomFactor = 0.3;
  return (
    <div className="flex justify-center">
      <div className="space-x-8 text-5xl">
        <button
          onClick={() => {
            if (context.zoom <= 1) {
              return;
            }
            const newZoom = currentZoom - zoomFactor;
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
          -
        </button>
        <button
          onClick={() => {
            if (context.zoom > 2) {
              return;
            }
            const newZoom = currentZoom + zoomFactor;
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
          +
        </button>
      </div>
    </div>
  );
}
