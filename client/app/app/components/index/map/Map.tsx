import type {
  MapPlaceData,
  MapOptions,
  MapLabelOptions,
  MapLabelPosData,
  Coords,
} from "~/types/map";
import { useFetchV3 } from "~/utils/fetchHook";
import { useEffect, useRef, useState } from "react";
import MapPlaceComponent from "./Place";
import { useMapContextProvider } from "./MapContextProvider";
import MapMediaFullView from "./MapMediaFullView";
import MapPlaceDetails from "./MapPlaceDetails";
import MapNav from "./MapNav";
import paths from "src/assets/map-paths.svg";
import useMoveMap, { useMovePlaceLabel } from "./move";
// import { placeLabelsData } from "./placeLabels";
import placeLabelsData from "src/data/map-labels-data.json";
import { MAP_OPTIONS } from "./utils";
import MapLabelGroup from "./MapLabelGroup";

export const options = MAP_OPTIONS;
export default function Map() {
  const { fetchedData } = useFetchV3("content/places");
  const placesData = fetchedData?.data?.data as MapPlaceData[];
  const placesObj = placesData
    ? placesData.reduce((prev, cur) => {
        const slug = cur.slug;
        prev[slug] = cur;
        return prev;
      }, {})
    : null;
  const mapSurface = useRef<HTMLDivElement | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapImage = useRef<HTMLImageElement | null>(null);
  const mapLabels = useRef<HTMLDivElement | null>(null);
  const mapContent = useRef<HTMLDivElement | null>(null);
  const context = useMapContextProvider();

  useEffect(() => {
    if (!mapSurface.current && !mapContainer.current) {
      return;
    }

    const map = mapSurface.current;
    const container = mapContainer.current;

    useMoveMap(container, map, {
      moveEnabled: !context.fullView,
    });
  }, [mapSurface]);
  // get coords on click
  // useEffect(() => {
  //   if (!mapContent.current) {
  //     return;
  //   }
  //   const onMousedown = (e) => {
  //     const mapBox = mapContent.current.getBoundingClientRect();
  //     console.log(mapBox.left);
  //     context.setMapPos({
  //       x: Math.floor(e.clientX - mapBox.left),
  //       y: Math.floor(e.clientY - mapBox.top),
  //     });
  //   };
  //   mapSurface.current.onclick = (e) => onMousedown(e);
  // });
  const [mapOffsetInit, setMapOffsetInit] = useState<null | Coords>(null);
  // init offsets
  useEffect(() => {
    if (!mapOffsetInit && mapSurface.current) {
      const initOffsets = {
        x: Math.floor(
          (mapContainer.current.clientWidth - mapSurface.current.clientWidth) /
            2,
        ),
        y: Math.floor(
          (mapContainer.current.clientHeight -
            mapSurface.current.clientHeight) /
            2,
        ),
      };
      setMapOffsetInit(initOffsets);
      mapSurface.current.style.left = `${initOffsets.x}px`;
      mapSurface.current.style.top = `${initOffsets.y}px`;
    }
  }, []);
  const labelsSouthEast = ["goris", "tatev", "sisian", "jermuk"];
  //scale label offsets
  useEffect(() => {
    if (!mapLabels.current) {
      return;
    }
    mapLabels.current.style.scale = context.zoom;
  }, [context.zoom]);
  const placeLabelsDataTyped = placeLabelsData as MapLabelPosData[];
  return (
    <div draggable="false" className="">
      <MapNav
        map={mapSurface.current}
        container={mapContainer.current}
        mapImage={mapImage.current}
        mapContent={mapContent.current}
      ></MapNav>
      <div
        className="index-container-1 relative h-[md:1180px] overflow-clip border border-text-main"
        ref={mapContainer}
        draggable="false"
        id="map-container"
      >
        <div
          id="map-surface"
          ref={mapSurface}
          style={{
            width: options.mapContentSize.x + options.mapPadding,
            height: options.mapContentSize.y + options.mapPadding,
          }}
          className="absolute flex items-center justify-center "
        >
          <div
            id="map-content"
            className="absolute size-full"
            ref={mapContent}
            style={{
              width: options.mapContentSize.x,
              height: options.mapContentSize.y,
            }}
          >
            {/* <div className="relative "> */}
            <img
              draggable="false"
              aria-disabled
              id="map-img"
              className="object-contain select-none h-full"
              src={paths}
              ref={mapImage}
            />
            {placesObj && context.fullView ? (
              <MapMediaFullView>
                <MapPlaceDetails
                  place={context.placeSelected}
                ></MapPlaceDetails>
              </MapMediaFullView>
            ) : (
              ""
            )}
            {/* top-[1064px] left-[1967px] */}
            {placesObj ? (
              <div className="" id="map-labels">
                <MapLabelGroup offsets={{ x: 1965, y: 1256 }}>
                  {placeLabelsDataTyped.map((item) => {
                    if (labelsSouthEast.includes(item.name)) {
                      return (
                        <MapPlaceComponent
                          place={placesObj[item.name]}
                          options={{
                            ...item.options,
                            position: "relative",
                            grouped: true,
                          }}
                        ></MapPlaceComponent>
                      );
                    }
                  })}
                </MapLabelGroup>
                {placeLabelsDataTyped.map((item) => {
                  if (!labelsSouthEast.includes(item.name)) {
                    return (
                      <MapPlaceComponent
                        place={placesObj[item.name]}
                        options={item.options}
                      ></MapPlaceComponent>
                    );
                  }
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
