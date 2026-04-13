import type { MapPlaceData } from "~/types/map";
import { useFetchV3 } from "~/utils/fetchHook";
import { useEffect, useRef } from "react";
import draw from "./canvas";
import MapPlaceComponent from "./Place";
import { useMapContextProvider } from "./MapContextProvider";
import MapMediaFullView from "./MapMediaFullView";
import MapPlaceDetails from "./MapPlaceDetails";

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
  const mapContent = useRef(null);
  useEffect(() => {
    if (!mapSurface.current || !mapContent.current) {
      return;
    }
    const mapContentOffsets = {
      x: Math.floor(
        (mapSurface.current.clientWidth - mapContent.current.clientWidth) / 2,
      ),
      y: Math.floor(
        (mapSurface.current.clientHeight - mapContent.current.clientHeight) / 2,
      ),
    };
    mapContent.current.style.top = `${mapContentOffsets.y}px`;
    mapContent.current.style.left = `${mapContentOffsets.x}px`;
  });
  useEffect(() => {
    if (!mapSurface.current || !mapContainer.current) {
      return;
    }
    const initOffset = {
      x: Math.floor(
        (mapSurface.current.clientWidth - mapContainer.current.clientWidth) / 2,
      ),
      y: Math.floor(
        (mapSurface.current.clientHeight - mapContainer.current.clientHeight) /
        2,
      ),
    };
    mapSurface.current.style.left = `${-initOffset.x}px`;
    mapSurface.current.style.top = `${-initOffset.y}px`;
    let mouseDownX: number, mouseDownY: number;
    let mapOffsetX: number = -initOffset.x;
    let mapOffsetY: number = -initOffset.y;
    const thresholds = {
      top: 0,
      bottom:
        -mapSurface.current.clientHeight + mapContainer.current.clientHeight,
      left: 0,
      right: -mapSurface.current.clientWidth + mapContainer.current.clientWidth,
    };
    const move = (e: MouseEvent) => {
      // console.log("mouse down", mouseDownX, mouseDownY);
      // console.log(mapSurface.current);
      const limits = {
        top: mapSurface.current.offsetTop > thresholds.top,
        bottom: mapSurface.current.offsetTop < thresholds.bottom,
        left: mapSurface.current.offsetLeft > thresholds.left,
        right: mapSurface.current.offsetLeft < thresholds.right,
      };
      const allowedMove = {
        top: !limits.bottom,
        bottom: !limits.top,
        left: !limits.right,
        right: !limits.left,
      };
      if (!allowedMove.right) {
        mapSurface.current.style.left = `0px`;
      } else if (!allowedMove.left) {
        mapSurface.current.style.left = `${mapContainer.current.clientWidth - mapSurface.current.clientWidth}px`;
      } else {
        mapSurface.current.style.left = `${mapOffsetX + e.clientX - mouseDownX}px`;
      }

      if (!allowedMove.bottom) {
        mapSurface.current.style.top = `0px`;
      } else if (!allowedMove.top) {
        mapSurface.current.style.top = `${mapContainer.current.clientHeight - mapSurface.current.clientHeight}px`;
      } else {
        mapSurface.current.style.top = `${mapOffsetY + e.clientY - mouseDownY}px`;
      }
    };
    mapSurface.current.addEventListener("mousedown", (e) => {
      mouseDownX = e.clientX;
      mouseDownY = e.clientY;
      document.addEventListener("mousemove", move);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", move);
          mapOffsetX = mapSurface.current.offsetLeft;
          mapOffsetY = mapSurface.current.offsetTop;
        },
        { once: true },
      );
    });
  }, [mapSurface]);

  const canvas = useRef(null);
  useEffect(() => {
    if (!canvas.current) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    const canvasSize = { w: 1600, h: 1600 };
    canvas.current.width = canvasSize.w;
    canvas.current.height = canvasSize.h;
    draw(canvas);
  }, [canvas]);
  const context = useMapContextProvider();
  return (
    <div
      className="index-container-1 relative h-[md:1180px] overflow-clip border border-text-main"
      ref={mapContainer}
    >
      <div className="w-400 h-400 relative" ref={mapSurface}>
        <canvas ref={canvas} className="w-400 h-400"></canvas>
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
  );
}
