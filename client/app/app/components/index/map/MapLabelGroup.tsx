import type { Coords, MapPlaceData } from "~/types/map";
import MapPlaceComponent from "./Place";
export default function MapLabelGroup({
  name,
  labels,
  offsets,
}: {
  name: string;
  labels: MapPlaceData[];
  offsets: Coords;
}) {
  return (
    <div
      className={`absolute flex flex-col items-center w-fit -translate-y-full`}
      style={{
        left: offsets.x,
        top: offsets.y,
      }}
    >
      {labels.map((place) => {
        return (
          <MapPlaceComponent
            key={`label-grp-${name}`}
            place={place}
            options={{ position: "relative", dot: false, grouped: true }}
          ></MapPlaceComponent>
        );
      })}
    </div>
  );
}
