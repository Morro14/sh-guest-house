import type { MapPlaceData } from "~/types/map";
import MapPlace from "./Place";
import { useFetchV3 } from "~/utils/fetchHook";
import { useEffect, useRef, useState } from "react";

export default function Map() {
  const { fetchedData } = useFetchV3("content/places");
  const placesData = fetchedData?.data?.data as MapPlaceData[];
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const placesObj = placesData
    ? placesData.reduce((prev, cur) => {
        const slug = cur.slug;
        prev[slug] = cur;
        return prev;
      }, {})
    : null;
  const mapSurface = useRef<HTMLDivElement | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapSurface.current || !mapContainer.current) {
      return;
    }
    console.log("map container", mapContainer.current);
    const initOffset = {
      x: Math.floor(
        (mapSurface.current.clientWidth - mapContainer.current.clientWidth) / 2,
      ),
      y: Math.floor(
        (mapSurface.current.clientHeight - mapContainer.current.clientHeight) /
          2,
      ),
    };
    // setMapOffset({ x: initOffset.x, y: initOffset.y });
    mapSurface.current.style.left = `${-initOffset.x}px`;
    mapSurface.current.style.top = `${-initOffset.y}px`;
    let mouseDownX: number, mouseDownY: number;
    let mapOffsetX: number = -initOffset.x;
    let mapOffsetY: number = -initOffset.y;
    // const initPos = { x: mapOffset.x, y: mapOffset.y };
    //
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
        top: mouseDownY > e.clientY || !limits.top,
        bottom: mouseDownY > e.clientY || !limits.bottom,
        left: mouseDownX > e.clientX || !limits.left,
        right: mouseDownX < e.clientX || !limits.right,
      };
      if (!allowedMove.left) {
        mapSurface.current.style.left = `0px`;
      } else if (!allowedMove.right) {
        mapSurface.current.style.left = `${mapContainer.current.clientWidth - mapSurface.current.clientWidth}px`;
      } else {
        mapSurface.current.style.left = `${mapOffsetX + e.clientX - mouseDownX}px`;
      }

      if (!allowedMove.top) {
        mapSurface.current.style.top = `0px`;
      } else if (!allowedMove.bottom) {
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
  return (
    <div
      className="index-container-1 relative h-[md:1180px] overflow-clip border border-text-main"
      ref={mapContainer}
    >
      <div className="w-500 h-500 relative bg-olive-400" ref={mapSurface}>
        {placesObj ? <MapPlace place={placesObj["spitakavor"]}></MapPlace> : ""}
      </div>
    </div>
  );
}
