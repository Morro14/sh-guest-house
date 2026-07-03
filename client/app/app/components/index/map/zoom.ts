import type { Coords } from "~/types/map";
import type { Size } from "./utils";
import { getAnchorRatio, getMapPosBound, MAP_OPTIONS } from "./utils";

interface zoomMapArgs {
  mapContainer: HTMLDivElement;
  mapSurface: HTMLDivElement;
  mapContent: HTMLDivElement;
  zoomNew: number;
  anchorRatio?: Coords;
  anchor?: Coords;
}
export function zoomMap({
  mapContainer,
  mapSurface,
  mapContent,
  zoomNew,
  anchorRatio,
  anchor,
}: zoomMapArgs) {
  if (zoomNew < MAP_OPTIONS.zoomMin || zoomNew > MAP_OPTIONS.zoomMax) {
    return;
  }
  // console.log("new scale", zoomNew);
  // console.log("anchorRatio", anchorRatio);
  console.log("anchor", anchor);
  const zoomNewNorm = `${Math.floor(zoomNew * 100) / 100}`;
  // mapSurface.style.left = `${Math.floor(newLeft)}px`;
  // mapSurface.style.top = `${Math.floor(newTop)}px`;
  mapSurface.style.scale = zoomNewNorm;
  mapContent.style.scale = zoomNewNorm;
}
