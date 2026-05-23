import { MAP_OPTIONS } from "./utils";
import { useMapContextProvider } from "./MapContextProvider";
import { zoomMap } from "./zoom";

export default function MapNav({
  mapSurface,
  container,
  mapImage,
  mapContent,
}: {
  mapSurface: HTMLDivElement;
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
    mapSurface.style.left = `${offsets.x}px`;
    mapSurface.style.top = `${offsets.y}px`;
    mapSurface.style.width = `${(mapOptions.mapContentSize.x + mapOptions.mapPadding) * zoom}px`;
    mapSurface.style.height = `${(mapOptions.mapContentSize.y + mapOptions.mapPadding) * zoom}px`;
    mapContent.style.height = `${mapOptions.mapContentSize.y * zoom}px`;
    mapContent.style.width = `${mapOptions.mapContentSize.x * zoom}px`;
    // mapSurface.style.scale = `${zoom}`;
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
            zoomMap({
              container,
              mapSurface,
              mapContent,
              currentZoom,
              newZoom,
            });
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
            zoomMap({
              container,
              mapSurface,
              mapContent,
              currentZoom,
              newZoom,
            });
            context.setZoom(newZoom);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
