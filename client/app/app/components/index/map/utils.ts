import type {
  Coords,
  MapElements,
  MapOptions,
  MapPlaceData,
} from "~/types/map";
import { placeLabelsData } from "./placeLabels";

export const MAP_OPTIONS: MapOptions = {
  mapContentSize: { x: 2043, y: 1420 },
  mapPadding: 200,
};
const MAP_SIZE_INIT = {
  x: MAP_OPTIONS.mapPadding + MAP_OPTIONS.mapContentSize.x,
  y: MAP_OPTIONS.mapPadding + MAP_OPTIONS.mapContentSize.y,
};

export interface Size {
  x: number;
  y: number;
}
export interface ZoomState {
  mapOffsets: Size;
  containerSize: Size;
  zoomCurrent: number;
  zoomNew: number;
  pinchCenter?: Coords;
  mapRect?: DOMRect;
}

export function boundMapPos(mapSize: Size, containerSize: Size, newPos: Size) {
  const offsetX = Math.floor(
    Math.min(Math.max(-newPos.x, containerSize.x - mapSize.x), 0),
  );
  const offsetY = Math.floor(
    Math.min(Math.max(-newPos.y, containerSize.y - mapSize.y), 0),
  );
  return { x: offsetX, y: offsetY };
}
export function getMapCenteredOffsets(state: ZoomState) {
  // console.log("state", state);
  const mapOffsets = structuredClone(state.mapOffsets);
  if (state.pinchCenter) {
    mapOffsets.x = state.pinchCenter.x - state.mapRect.left;
    mapOffsets.y = state.pinchCenter.y - state.mapRect.top;
  }
  const centerRatio = {
    x:
      (-mapOffsets.x + state.containerSize.x / 2) /
      (MAP_SIZE_INIT.x * state.zoomCurrent),

    y:
      (-mapOffsets.y + state.containerSize.y / 2) /
      (MAP_SIZE_INIT.y * state.zoomCurrent),
  };
  // console.log("ratio", centerRatio);
  const newOffsets = {
    x:
      MAP_SIZE_INIT.x * state.zoomNew * centerRatio.x -
      state.containerSize.x / 2,
    y:
      MAP_SIZE_INIT.y * state.zoomNew * centerRatio.y -
      state.containerSize.y / 2,
  };
  // console.log("newOffsets", newOffsets);
  const boundOffsets = boundMapPos(
    { x: MAP_SIZE_INIT.x * state.zoomNew, y: MAP_SIZE_INIT.y * state.zoomNew },
    state.containerSize,
    newOffsets,
  );
  // console.log("bound", boundOffsets);
  return boundOffsets;
}

export async function writePlaceLabelData(placeName: string, offsets: Coords) {
  const labelData = placeLabelsData.find((item) => item.name === placeName);
  labelData.options.offsets = offsets;
  try {
    const response = await fetch("api/save-map-labels-data", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(labelData),
    });
    if (response.ok) console.log("✔️ Coordinates written to JSON file");
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
}
