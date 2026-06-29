import type {
  MapPlaceData,
  MapLabelPosData,
  Coords,
  TownLabelPosData,
  MapLabelGroupData,
  MapMessagesModal,
} from "~/types/map";
import { useFetchV3 } from "~/utils/fetchHook";
import { useCallback, useEffect, useRef, useState } from "react";
import MapPlaceComponent from "./Place";
import { useMapContextProvider } from "./MapContextProvider";
import MapMediaFullView from "./MapMediaFullView";
import MapPlaceDetails from "./MapPlaceDetails";
import MapNav from "./MapNav";
import paths from "src/assets/map-paths.svg";
import placeLabelsData from "src/data/map-labels-data.json";
import { MAP_OPTIONS, objDeepMerge, writeMapItemPosData } from "./utils";
import MapLabelGroup from "./MapLabelGroup";
import { getMapHandlers } from "./handlers";
import townLabelsData from "src/data/town-labels.json";
import placeDotsPosData from "src/data/place-dots-data.json";
import labelGroupsData from "src/data/label-groups-data.json";
import messagesModal from "./modalMessages/mapMessages.json";
import TownLabel from "./TownLabel";
import MapMsgsModal from "./modalMessages/Layout";
import MsgLayout from "./modalMessages/MsgLayout";

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
    if (context.mapElements) {
      return;
    }
    context.setMapElements({
      mapSurface,
      mapContainer,
      mapImage,
      mapLabels,
      mapContent,
    });
  }, [context.mapElements]);
  const getMapHandlersCached = useCallback(getMapHandlers, []);

  useEffect(() => {
    if (!context.mapElements) {
      return;
    }
    const map = mapSurface.current;
    const {
      handlePointerDown,
      handlePinchMove,
      handleMapMove,
      handleMapPointerUp,
      handlePinchPointerUp,
    } = getMapHandlersCached(
      {
        mapSurface: mapSurface.current,
        mapContent: mapContent.current,
        mapContainer: mapContainer.current,
      },
      context,
    );
    const removeEventListeners = () => {
      document.removeEventListener("pointermove", handleMapMove);
      document.removeEventListener("pointerup", handleMapPointerUp);
      map.removeEventListener("pointerdown", handlePointerDown);
      map.removeEventListener("pointermove", handlePinchMove);
      map.removeEventListener("pointerup", handlePinchPointerUp);
    };

    if (!context.fullView) {
      document.addEventListener("pointermove", handleMapMove);
      document.addEventListener("pointerup", handleMapPointerUp);
      map.addEventListener("pointerdown", handlePointerDown);
      map.addEventListener("pointermove", handlePinchMove);
      map.addEventListener("pointerup", handlePinchPointerUp);
    } else {
      removeEventListeners();
    }

    return () => removeEventListeners();
  }, [context.fullView]);
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
  //scale label offsets
  useEffect(() => {
    if (!mapLabels.current) {
      return;
    }
    mapLabels.current.style.scale = context.zoom;
  }, [context.zoom]);
  //add initial place labels data
  useEffect(() => {
    if (!placesData) {
      return;
    }
    placesData.forEach((place) => {
      if (!placeLabelsData.find((labelData) => labelData.name === place.slug)) {
        writeMapItemPosData(place.slug, { x: 0, y: 0 }, "placeLabel");
      }
      if (
        !placeDotsPosData.find((labelData) => labelData.name === place.slug)
      ) {
        writeMapItemPosData(place.slug, { x: 0, y: 0 }, "placeDot");
      }
    });
  }, [placesData]);
  // const townLabels = townLabelsData;
  const placeLabelsDataTyped = placeLabelsData as MapLabelPosData[];
  const townLabelsDataTyped = townLabelsData as TownLabelPosData[];
  const labelGroupsDataTyped = labelGroupsData as MapLabelGroupData[];
  const msgsModal = messagesModal as MapMessagesModal[];
  return (
    <div>
      <MapNav
        mapSurface={mapSurface.current}
        container={mapContainer.current}
        mapImage={mapImage.current}
        mapContent={mapContent.current}
      ></MapNav>
      <div
        className="index-container-1 relative md:h-[1000px] h-[720px] overflow-clip border border-text-main touch-none"
        ref={mapContainer}
        draggable="false"
        id="map-container"
      >
        <MapMsgsModal>
          {context.modalMessagesToShow.map((msg) => (
            <MsgLayout msg={msg}></MsgLayout>
          ))}
        </MapMsgsModal>
        <div
          id="map-surface"
          onPointerDown={() => {}}
          ref={mapSurface}
          style={{
            width: options.mapContentSize.x + options.mapPadding,
            height: options.mapContentSize.y + options.mapPadding,
          }}
          className={`absolute flex items-center justify-center ${!context.fullView ? "cursor-move" : "cursor-default"}`}
        >
          <div
            id="map-content"
            className="relative size-full touch-none"
            aria-disabled
            ref={mapContent}
            style={{
              width: options.mapContentSize.x,
              height: options.mapContentSize.y,
            }}
          >
            <img
              draggable="false"
              aria-disabled
              id="map-img"
              className="object-contain select-none h-full touch-none"
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
                {labelGroupsData.map((labelGroup) => {
                  const places = placesData.filter((item) =>
                    labelGroup.places.includes(item.slug),
                  );
                  return (
                    <MapLabelGroup
                      labels={places}
                      offsets={{ x: 1534, y: 1358 }}
                      name={labelGroup.name}
                      key={`labelgroup-${labelGroup.name}`}
                    ></MapLabelGroup>
                  );
                })}
                {placeLabelsDataTyped.map((item) => {
                  return (
                    <MapPlaceComponent
                      place={placesObj[item.name]}
                      options={item.options}
                      key={`placelabel-${item.name}`}
                    ></MapPlaceComponent>
                  );
                })}
              </div>
            ) : (
              ""
            )}
            {townLabelsDataTyped ? (
              <div id="town-labels">
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
        </div>
      </div>
    </div>
    // </div>
  );
}
