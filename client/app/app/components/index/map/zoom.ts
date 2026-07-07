import type { Coords } from "~/types/map";
import { MAP_OPTIONS, MAP_SIZE_INIT } from "./utils";

interface zoomMapArgs {
  mapContainer: HTMLDivElement;
  mapSurface: HTMLDivElement;
  mapContent: HTMLDivElement;
  zoomNew: number;
  anchorRatio?: Coords;
  anchor?: Coords;
  zoomCurrent?: number;
}
export function zoomMap({
  mapContainer,
  mapSurface,
  mapContent,
  zoomNew,
  anchorRatio,
  anchor,
  zoomCurrent,
}: zoomMapArgs) {
  if (zoomNew < MAP_OPTIONS.zoomMin || zoomNew > MAP_OPTIONS.zoomMax) {
    return;
  }
  // mapSurface.style.left = `${Math.floor(newLeft)}px`;
  // mapSurface.style.top = `${Math.floor(newTop)}px`;
  // const translateX = -mapSurface.offsetLeft + anchor.x;
  // const translateY = -mapSurface.offsetTop + anchor.y;
  // const mapOffsetInit = {
  //   x: mapContainer.clientWidth / 2 - MAP_SIZE_INIT.x / 2,
  //   y: mapContainer.clientHeight / 2 - MAP_SIZE_INIT.y / 2,
  // };
  const newX = MAP_SIZE_INIT.x * zoomNew * anchorRatio.x - anchor.x;
  const newY = MAP_SIZE_INIT.y * zoomNew * anchorRatio.y - anchor.y;
  // console.log(MAP_SIZE_INIT.x, zoomNew, anchorRatio.x, anchor.x);
  // anchor.y * (zoomNew - zoomCurrent);
  // console.log("zoom", zoomNew);
  // console.log("anchor", anchor);
  // console.log("anchorRatio", anchorRatio);
  mapSurface.style.left = `${-newX}px`;
  mapSurface.style.top = `${-newY}px`;
  // mapSurface.style.transformOrigin = `${translateX}px ${translateY}px`;
  mapSurface.style.scale = `${zoomNew}`;
  // labels.style.scale = `${`${Math.floor(Math.pow(1 / zoomNew, 0.8) * 100) / 100}`}`;
  // mapContent.style.scale = `${zoomNew}`;
}
