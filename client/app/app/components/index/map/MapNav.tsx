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
  const context = useMapContextProvider();
  const currentZoom = context.zoom;
  const zoomFactor = 0.3;
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
