import type { Coords, MapZoomArgs } from "~/types/map";
import type { ZoomState, Size } from "./utils";
import { getMapCenteredOffsets } from "./utils";
import { MAP_OPTIONS } from "./utils";

export function zoomMap({
  container,
  mapSurface,
  mapContent,
  currentZoom,
  newZoom,
  pinchCenter = null,
}: MapZoomArgs) {
  const state: ZoomState = {
    mapOffsets: { x: mapSurface.offsetLeft, y: mapSurface.offsetTop },
    containerSize: {
      x: container.clientWidth,
      y: container.clientHeight,
    },
    zoomCurrent: currentZoom,
    zoomNew: newZoom,
    pinchCenter: pinchCenter,
    mapRect: mapSurface.getBoundingClientRect(),
  };
  let centeredOffsets = { x: 0, y: 0 };
  if (pinchCenter) {
    centeredOffsets = pinchCenter;
  } else {
    centeredOffsets = getMapCenteredOffsets(state);
  }
  // if (newZoom < 0.5 || newZoom > 2) {
  //   return;
  // }
  setMapZoomed(mapSurface, mapContent, centeredOffsets, newZoom);
}
export const setMapZoomed = (
  mapSurface: HTMLDivElement,
  mapContent: HTMLDivElement,
  offsets: Size,
  zoom: number,
) => {
  mapSurface.style.left = `${offsets.x}px`;
  mapSurface.style.top = `${offsets.y}px`;
  mapSurface.style.width = `${Math.floor((MAP_OPTIONS.mapContentSize.x + MAP_OPTIONS.mapPadding) * zoom)}px`;
  mapSurface.style.height = `${Math.floor((MAP_OPTIONS.mapContentSize.y + MAP_OPTIONS.mapPadding) * zoom)}px`;
  mapContent.style.height = `${Math.floor(MAP_OPTIONS.mapContentSize.y * zoom)}px`;
  mapContent.style.width = `${Math.floor(MAP_OPTIONS.mapContentSize.x * zoom)}px`;
};
