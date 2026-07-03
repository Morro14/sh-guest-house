import { useMapContextProvider } from "./MapContextProvider";
import MapMediaFullView from "./MapMediaFullView";
import MapPlaceDetails from "./MapPlaceDetails";
import MapLabelGroup from "./MapLabelGroup";
import MapPlaceComponent from "./Place";
import townLabelsData from "src/data/town-labels.json";
import labelGroupsData from "src/data/label-groups-data.json";
import placeLabelsData from "src/data/map-labels-data.json";
import type {
  MapLabelGroupData,
  MapLabelPosData,
  MapPlaceData,
  TownLabelPosData,
} from "~/types/map";

export default function MapLabels({
  placesData,
}: {
  placesData: MapPlaceData[];
}) {
  console.log("placeData", placesData);
  const context = useMapContextProvider();
  const placeLabelsDataTyped = placeLabelsData as MapLabelPosData[];
  const townLabelsDataTyped = townLabelsData as TownLabelPosData[];
  const labelGroupsDataTyped = labelGroupsData as MapLabelGroupData[];
  const placesObj = placesData
    ? placesData.reduce((prev, cur) => {
        const slug = cur.slug;
        prev[slug] = cur;
        return prev;
      }, {})
    : null;
  return (
    <div className="" id="map-labels">
      {/* top-[1064px] left-[1967px] */}
      {placesObj
        ? placeLabelsDataTyped.map((item) => {
            return (
              <MapPlaceComponent
                place={placesObj[item.name]}
                options={item.options}
                key={`placelabel-${item.name}`}
              ></MapPlaceComponent>
            );
          })
        : ""}
    </div>
  );
}
