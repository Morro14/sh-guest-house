import type { PointerEvent } from "react";
import type {
  Coords,
  MapItemPosData,
  MapLabelPosData,
  MapOptions,
  MovableItem,
  TownLabelPosData,
} from "~/types/map";

export const MAP_OPTIONS: MapOptions = {
  mapContentSize: { x: 2043, y: 1420 },
  mapPadding: 5000,
  zoomMin: 0.4,
  zoomMax: 2,
  zoomFactor: 0.2,
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
  let offsetX = 0;
  let offsetY = 0;
  const maxY = Math.floor(containerSize.y / 2);
  const minY = Math.floor(-mapSize.y + containerSize.y / 2);
  offsetY = Math.max(Math.min(maxY, newPos.y), minY);
  const maxX = Math.floor(containerSize.x / 2);
  const minX = Math.floor(-mapSize.x + containerSize.x / 2);
  offsetX = Math.max(Math.min(maxX, newPos.x), minX);

  return { x: offsetX, y: offsetY };
  // return newPos;
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
  const newOffsets = {
    x: -Math.floor(
      MAP_SIZE_INIT.x * state.zoomNew * centerRatio.x -
        state.containerSize.x / 2,
    ),
    y: -Math.floor(
      MAP_SIZE_INIT.y * state.zoomNew * centerRatio.y -
        state.containerSize.y / 2,
    ),
  };
  // console.log("centered offsets", newOffsets);
  const boundOffsets = boundMapPos(
    {
      x: Math.floor(MAP_SIZE_INIT.x * state.zoomNew),
      y: Math.floor(MAP_SIZE_INIT.y * state.zoomNew),
    },
    state.containerSize,
    newOffsets,
  );
  return boundOffsets;
}

export async function writeMapItemPosData(
  itemName: string,
  offsets: Coords,
  type: MovableItem,
) {
  let itemData = null;
  if (type === "placeLabel") {
    const placeData: MapLabelPosData = {
      name: itemName,
      type: type,
      options: { offsets: offsets },
    };
    placeData.options.offsets = offsets;
    itemData = placeData;
  } else if (["townLabel", "placeDot"].includes(type)) {
    const itemData_: MapItemPosData = {
      name: itemName,
      offsets: offsets,
      type: type,
    };
    itemData_.offsets = offsets;
    itemData = itemData_;
  }
  try {
    const response = await fetch("api/save-map-labels-data", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(itemData),
    });
    if (response.ok) console.log("✔️ Coordinates written to JSON file");
  } catch (err) {
    console.error("❌ Save failed:", err);
  }
}
// export async function writeTownNameData(townName: string, offsets: Coords) {
//   const labelData = townLabelsData.find((item) => item.name === townName);
//   labelData["type"] = "townLabel";
//   labelData.offsets = offsets;
//   try {
//     const response = await fetch("api/save-map-labels-data", {
//       method: "POST",
//       headers: { "Content-type": "application/json" },
//       body: JSON.stringify(labelData),
//     });
//     if (response.ok) console.log("✔️ Coordinates written to JSON file");
//   } catch (err) {
//     console.error("❌ Save failed:", err);
//   }
// }
export const isClickNotDrag = (
  posInit: Coords,
  leeway: number,
  e: PointerEvent<HTMLDivElement>,
) => {
  if (
    Math.abs(posInit.x - e.clientX) > leeway &&
    Math.abs(posInit.y - e.clientY) > leeway
  ) {
    return false;
  }
  return true;
};
