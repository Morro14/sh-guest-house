import type { MapPlaceData, Coords, MapMessagesModal } from "~/types/map";
import { useFetchV3 } from "~/utils/fetchHook";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMapContextProvider } from "./MapContextProvider";
import MapNav from "./MapNav";
import paths from "src/assets/map-paths.svg";
import placeLabelsData from "src/data/map-labels-data.json";
import { MAP_OPTIONS, writeMapItemPosData } from "./utils";
import { getMapHandlers } from "./handlers";
import placeDotsPosData from "src/data/place-dots-data.json";
import MapMsgsModal from "./modalMessages/Layout";
import MsgLayout from "./modalMessages/MsgLayout";
import MapLabels from "./MapLabels";
import MapMediaFullView from "./MapMediaFullView";
import MapPlaceDetails from "./MapPlaceDetails";
import MapZoomModal from "./MapZoomModal";

export const options = MAP_OPTIONS;
export default function Map() {
  const { fetchedData } = useFetchV3("content/places");
  const placesData = fetchedData?.data?.data as MapPlaceData[];
  const mapSurface = useRef<HTMLDivElement | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapImage = useRef<HTMLImageElement | null>(null);
  const mapLabels = useRef<HTMLDivElement | null>(null);
  const mapContent = useRef<HTMLDivElement | null>(null);
  const context = useMapContextProvider();

  useEffect(() => {
    if (Object.keys(context.mapElements).length > 0) {
      return;
    }
    // console.log("setting context elements");
    context.setMapElements({
      mapSurface: mapSurface.current,
      mapContainer: mapContainer.current,
      mapImage: mapImage.current,
      mapLabels: mapLabels.current,
      mapContent: mapContent.current,
    });
  }, [mapSurface, mapContainer, mapContent]);
  const getMapHandlersCached = useCallback(getMapHandlers, []);

  useEffect(() => {
    if (!context.mapElements) {
      return;
    }
    const map = mapSurface.current;
    const {
      handlePointerDown,
      handlePinchMove,
      // handleMapMove,
      // handleMapPointerUp,
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
      // document.removeEventListener("pointermove", handleMapMove);
      // document.removeEventListener("pointerup", handleMapPointerUp);
      map.removeEventListener("pointerdown", handlePointerDown);
      map.removeEventListener("pointermove", handlePinchMove);
      map.removeEventListener("pointerup", handlePinchPointerUp);
    };

    if (!context.fullView) {
      // document.addEventListener("pointermove", handleMapMove);
      // document.addEventListener("pointerup", handleMapPointerUp);
      map.addEventListener("pointerdown", handlePointerDown);
      map.addEventListener("pointermove", handlePinchMove);
      map.addEventListener("pointerup", handlePinchPointerUp);
    } else {
      removeEventListeners();
    }

    return () => removeEventListeners();
  }, [context.fullView]);
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
  return (
    <div>
      <MapNav
        mapSurface={mapSurface.current}
        mapContainer={mapContainer.current}
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
          {context.modalMessagesToShow.map((msg: MapMessagesModal) => (
            <MsgLayout key={`map-msg-modal-${msg.name}`} msg={msg}></MsgLayout>
          ))}
        </MapMsgsModal>
        <MapZoomModal></MapZoomModal>
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
            className="relative size-full touch-none border border-dashed border-gray-warm-inactive"
            aria-disabled
            ref={mapContent}
            style={{
              width: options.mapContentSize.x,
              height: options.mapContentSize.y,
            }}
          >
            <MapLabels placesData={placesData}></MapLabels>
            {placesData && context.fullView ? (
              <MapMediaFullView>
                <MapPlaceDetails
                  place={context.placeSelected}
                ></MapPlaceDetails>
              </MapMediaFullView>
            ) : (
              ""
            )}
            <img
              draggable="false"
              aria-disabled
              id="map-img"
              className="object-contain select-none h-full touch-none"
              src={paths}
              ref={mapImage}
            />
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
