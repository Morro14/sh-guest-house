import type { Coords, MapPlaceData } from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import MapPlaceComponent from "./Place";
export default function MapLabelGroup({
  labels,
  offsets,
}: {
  labels: MapPlaceData[];
  offsets: Coords;
}) {
  const context = useMapContextProvider();
  const scaleLabelGroupOffsets = (zoom: number, offsets: Coords) => {
    const newX = Math.floor(offsets.x * zoom);
    const newY = Math.floor(offsets.y * zoom);
    return { x: newX, y: newY };
  };
  const offsetsScaled = scaleLabelGroupOffsets(context.zoom, offsets);
  return (
    <div
      className={`absolute flex flex-col items-center w-fit -translate-y-full`}
      style={{ left: offsetsScaled.x, top: offsetsScaled.y }}
    >
      {labels.map((place) => {
        return (
          <MapPlaceComponent
            place={place}
            options={{ position: "relative", dot: false, grouped: true }}
          ></MapPlaceComponent>
        );
      })}
    </div>
  );
}
