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
    let mouseDownX: number, mouseDownY: number;
    let mapOffsetX: number = 0,
      mapOffsetY: number = 0;
    // const initPos = { x: mapOffset.x, y: mapOffset.y };
    const move = (e: MouseEvent) => {
      // console.log("mouse down", mouseDownX, mouseDownY);
      // console.log(mapSurface.current);
      mapSurface.current.style.left = `${mapOffsetX + e.clientX - mouseDownX}px`;
      mapSurface.current.style.top = `${mapOffsetY + e.clientY - mouseDownY}px`;
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
      <div className="w-300 h-400 relative bg-olive-400" ref={mapSurface}>
        {placesObj ? <MapPlace place={placesObj["spitakavor"]}></MapPlace> : ""}
      </div>
    </div>
  );
}
