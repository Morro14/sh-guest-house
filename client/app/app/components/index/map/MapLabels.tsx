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
import TownLabel from "./TownLabel";

export default function MapLabels({
  placesData,
}: {
  placesData: MapPlaceData[];
}) {
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
  const groupedPlaces = [];
  return (
    <div className="relative" id="map-labels">
      {/* top-[1064px] left-[1967px] */}
      {placesObj
        ? labelGroupsDataTyped.map((labelGroup) => {
            const places = placesData.filter((item) =>
              labelGroup.places.includes(item.slug),
            );
            groupedPlaces.push(...places);
            return (
              <MapLabelGroup
                labels={places}
                offsets={labelGroup.offsets}
                name={labelGroup.name}
                key={`labelgroup-${labelGroup.name}`}
              ></MapLabelGroup>
            );
          })
        : ""}
      {placesObj
        ? placeLabelsDataTyped.map((place) => {
            if (
              groupedPlaces.find((placeGrouped: MapPlaceData) => {
                return place.name === placeGrouped.slug;
              })
            ) {
              return "";
            }
            return (
              <MapPlaceComponent
                place={placesObj[place.name]}
                options={place.options}
                key={`placelabel-${place.name}`}
              ></MapPlaceComponent>
            );
          })
        : ""}
      {townLabelsDataTyped ? (
        <div id="town-labels" className="z-5">
          {townLabelsDataTyped.map((item) => {
            return (
              <TownLabel
                townLabel={{ name: item.name, offsets: item.offsets }}
                key={`townlabel-${item.name}`}
              ></TownLabel>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
