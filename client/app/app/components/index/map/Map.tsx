import type { MapPlaceData } from "~/types/map";
import { useFetchV3 } from "~/utils/fetchHook";
import { useEffect, useRef } from "react";
import MapPlaceComponent from "./Place";
import { useMapContextProvider } from "./MapContextProvider";
import MapMediaFullView from "./MapMediaFullView";
import MapPlaceDetails from "./MapPlaceDetails";
import MapNav from "./MapNav";
import paths from "src/assets/map-paths.svg";
import useMoveMap from "./move";

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
  const context = useMapContextProvider();

  useEffect(() => {
    console.log("useEffect move");
    if (!mapSurface.current && !mapContainer.current) {
      return;
    }

    const map = mapSurface.current;
    const container = mapContainer.current;

    useMoveMap(container, map, {
      moveEnabled: !context.fullView,
    });
  }, [mapSurface]);

  return (
    <div>
      <MapNav
        map={mapSurface.current}
        container={mapContainer.current}
      ></MapNav>
      <div
        className="index-container-1 relative h-[md:1180px] overflow-clip border border-text-main"
        ref={mapContainer}
      >
        <div id="map-surface" className="absolute w-550 h-400" ref={mapSurface}>
          {/* <canvas */}
          {/*   id="map-canvas" */}
          {/*   ref={canvas} */}
          {/*   className="w-400 h-400 transition-all duration-150" */}
          {/* ></canvas> */}
          <img
            draggable="false"
            id="map-img"
            className="size-full object-none"
            src={paths}
          />
          {placesObj ? (
            <div>
              {context.fullView ? (
                <MapMediaFullView>
                  <MapPlaceDetails
                    place={context.placeSelected}
                  ></MapPlaceDetails>
                </MapMediaFullView>
              ) : (
                ""
              )}
              <MapPlaceComponent
                place={placesObj["spitakavor"]}
                options={{
                  offsets: { leftOffset: 825, topOffset: 455 },
                  contentPosition: "top",
                }}
              ></MapPlaceComponent>
              <MapPlaceComponent
                place={placesObj["dadal"]}
                options={{
                  offsets: { leftOffset: 690, topOffset: 1060 },
                  contentPosition: "bottom",
                }}
              ></MapPlaceComponent>
              <MapPlaceComponent
                place={placesObj["noravank"]}
                options={{
                  offsets: { leftOffset: 444, topOffset: 1210 },
                  contentPosition: "bottom",
                }}
              ></MapPlaceComponent>

              <MapPlaceComponent
                place={placesObj["areni"]}
                options={{
                  offsets: { leftOffset: 515, topOffset: 930 },
                  contentPosition: "top",
                }}
              ></MapPlaceComponent>
              <MapPlaceComponent
                place={placesObj["yegheg museum"]}
                options={{
                  offsets: { leftOffset: 798, topOffset: 936 },
                  contentPosition: "bottom",
                }}
              ></MapPlaceComponent>
              <MapPlaceComponent
                place={placesObj["tanaat"]}
                options={{
                  offsets: { leftOffset: 1154, topOffset: 538 },
                  contentPosition: "top",
                }}
              ></MapPlaceComponent>
              <MapPlaceComponent
                place={placesObj["tsahats"]}
                options={{
                  offsets: { leftOffset: 638, topOffset: 316 },
                  contentPosition: "top",
                }}
              ></MapPlaceComponent>
              <MapPlaceComponent
                place={placesObj["yerevan"]}
                options={{
                  offsets: { leftOffset: 312, topOffset: 880 },
                  contentPosition: "top",
                }}
              ></MapPlaceComponent>
              <div
                className="absolute flex flex-col gap-2"
                style={{ left: `${1260}px`, top: `${1080}px` }}
              >
                <MapPlaceComponent
                  place={placesObj["jermuk"]}
                  options={{
                    position: "relative",
                    contentPosition: "top",
                    dot: false,
                  }}
                ></MapPlaceComponent>
                <MapPlaceComponent
                  place={placesObj["sisian"]}
                  options={{
                    position: "relative",
                    contentPosition: "top",
                    dot: false,
                  }}
                ></MapPlaceComponent>
                <MapPlaceComponent
                  place={placesObj["goris"]}
                  options={{
                    position: "relative",
                    contentPosition: "top",
                    dot: false,
                  }}
                ></MapPlaceComponent>
                <MapPlaceComponent
                  place={placesObj["tatev"]}
                  options={{
                    position: "relative",
                    contentPosition: "top",
                    dot: false,
                  }}
                ></MapPlaceComponent>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
