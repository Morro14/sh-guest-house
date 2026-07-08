import type { PointerEvent } from "react";
import type {
  Coords,
  MapItemPosData,
  MapLabelPosData,
  MovableItem,
} from "~/types/map";

export const MAP_OPTIONS = {
  mapContentSize: { x: 2043, y: 1420 },
  mapPadding: 800,
  zoomMin: 0.4,
  zoomMax: 2,
  zoomFactor: 0.2,
  wheelZoom: true,
};
export const MAP_SIZE_INIT = {
  x: MAP_OPTIONS.mapContentSize.x + MAP_OPTIONS.mapPadding,
  y: MAP_OPTIONS.mapContentSize.y + MAP_OPTIONS.mapPadding,
};

export interface Size {
  x: number;
  y: number;
}
export interface ZoomState {
  mapSurface: HTMLDivElement;
  containerSize: Size;
  mapContent: HTMLDivElement;
  zoomNew: number;
  pinchCenter?: Coords;
  mapRect?: DOMRect;
}

export function boundMapPos(
  mapSurface: HTMLDivElement,
  mapContent: HTMLDivElement,
  mapContainerSize: Size,
  newPos: Coords,
  zoomNew: number,
) {
  const mapContentSize = {
    x: mapContent.clientWidth * zoomNew,
    y: mapContent.clientHeight * zoomNew,
  };
  const mapSurfaceSize = {
    x: mapSurface.clientWidth * zoomNew,
    y: mapSurface.clientHeight * zoomNew,
  };
  // console.log(
  //   "boound",
  //   mapSurfaceSize,
  //   mapContentSize,
  //   mapContainerSize,
  //   newPos,
  //   zoomNew,
  // );
  let minX = Math.floor(
    -mapSurfaceSize.x / 2 + (mapContainerSize.x * 3) / 4 - mapContentSize.x / 2,
  );
  let maxX = Math.floor(
    -mapSurfaceSize.x / 2 + mapContainerSize.x / 4 + mapContentSize.x / 2,
  );
  let minY = Math.floor(
    -mapSurfaceSize.y / 2 + (mapContainerSize.y * 3) / 4 - mapContentSize.y / 2,
  );
  let maxY = Math.floor(
    -mapSurfaceSize.y / 2 + mapContainerSize.y / 4 + mapContentSize.y / 2,
  );
  let offsetX = 0;
  let offsetY = 0;
  offsetY = Math.max(Math.min(maxY, newPos.y), minY);
  offsetX = Math.max(Math.min(maxX, newPos.x), minX);

  return { x: offsetX, y: offsetY };
}
export function getMapPosBound({
  zoomNew,
  anchorRatio,
  anchor,
}: {
  zoomNew: number;
  anchorRatio: Coords;
  anchor: Coords;
}) {
  const newX = -MAP_SIZE_INIT.x * zoomNew * anchorRatio.x + anchor.x;
  const newY = -MAP_SIZE_INIT.y * zoomNew * anchorRatio.y + anchor.y;
  const newOffsets = {
    x: Math.floor(newX),
    y: Math.floor(newY),
  };
  return newOffsets;
}
export function getAnchorRatio(
  mapContainer: HTMLDivElement,
  mapSurface: HTMLDivElement,
  offsets: Coords | null = null,
  // zoomNew: number,
) {
  // console.log("getAnchorRatio zoom", zoomNew);
  // console.log("offsets", offsets);
  const offsets_ = offsets || {
    x: mapContainer.clientWidth / 2,
    y: mapContainer.clientHeight / 2,
  };
  const scaleComputed = window.getComputedStyle(mapSurface).scale;
  // console.log("scaleComputed", scaleComputed);
  const scale =
    scaleComputed !== "none"
      ? Number(window.getComputedStyle(mapSurface).scale)
      : 1;
  // console.log("scale", scale);
  let anchorRatioX =
    (-mapSurface.offsetLeft + offsets_.x) / (MAP_SIZE_INIT.x * scale);
  anchorRatioX = Math.floor(anchorRatioX * 10000) / 10000;
  let anchorRatioY =
    (-mapSurface.offsetTop + offsets_.y) / (MAP_SIZE_INIT.y * scale);
  anchorRatioY = Math.floor(anchorRatioY * 10000) / 10000;
  const ratios = { x: anchorRatioX, y: anchorRatioY };
  return ratios;
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

export function objDeepMerge(target, source) {
  const isObject = (item) => typeof item === "object" && !Array.isArray(item);
  if (isObject(target)) {
    for (const key in source) {
      if (target[key] && isObject(source[key])) {
        objDeepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}
