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
  context?: any;
}
export function zoomMap({
  mapContainer,
  mapSurface,
  mapContent,
  zoomNew,
  anchorRatio,
  anchor,
  zoomCurrent,
  context,
}: zoomMapArgs) {
  if (zoomNew < MAP_OPTIONS.zoomMin || zoomNew > MAP_OPTIONS.zoomMax) {
    return;
  }
  if (zoomNew < MAP_OPTIONS.zoomMin) {
    return;
  }

  const newSizeX = MAP_SIZE_INIT.x * zoomNew;
  const newSizeY = MAP_SIZE_INIT.y * zoomNew;
  let minX = Math.floor(-newSizeX + mapContainer.clientWidth);
  let maxX = 0;
  let minY = Math.floor(-newSizeY + mapContainer.clientHeight);
  let maxY = 0;
  let offsetX = 0;
  let offsetY = 0;
  const newX = newSizeX * anchorRatio.x - anchor.x;
  const newY = newSizeY * anchorRatio.y - anchor.y;
  offsetX = Math.max(Math.min(maxX, -newX), minX);
  offsetY = Math.max(Math.min(maxY, -newY), minY);

  mapSurface.style.left = `${offsetX}px`;
  mapSurface.style.top = `${offsetY}px`;
  mapSurface.style.scale = `${zoomNew}`;
  context.current.setZoom(zoomNew);
}
