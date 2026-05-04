import { MAP_OPTIONS } from "./utils";
import { useMapContextProvider } from "./MapContextProvider";
import { getMapCenteredOffsets, type Size, type ZoomState } from "./utils";

export default function MapNav({
  map,
  container,
  mapImage,
  mapContent,
}: {
  map: HTMLDivElement;
  container: HTMLDivElement;
  mapContent: HTMLDivElement;
  mapImage: HTMLImageElement;
}) {
  const mapOptions = MAP_OPTIONS;
  const context = useMapContextProvider();
  const currentZoom = context.zoom;
  const zoomFactor = 0.3;
  const setMapZoomed = (offsets: Size, zoom: number) => {
    console.log("map zoom", zoom);
    // mapImage.style.scale = `${zoom}`;
    map.style.left = `${offsets.x}px`;
    map.style.top = `${offsets.y}px`;
    map.style.width = `${(mapOptions.mapContentSize.x + mapOptions.mapPadding) * zoom}px`;
    map.style.height = `${(mapOptions.mapContentSize.y + mapOptions.mapPadding) * zoom}px`;
    mapContent.style.height = `${mapOptions.mapContentSize.y * zoom}px`;
    mapContent.style.width = `${mapOptions.mapContentSize.x * zoom}px`;
    // map.style.scale = `${zoom}`;
  };
  return (
    <div className="">
      {context.mapPos ? (
        <div className="font-sans">{`${context.mapPos.x} ${context.mapPos.y}`}</div>
      ) : (
        ""
      )}
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
