export const MAP_SIZE_INIT = { x: 2200, y: 1600 };

export interface Size {
  x: number;
  y: number;
}
export interface ZoomState {
  mapOffsets: Size;
  containerSize: Size;
  zoomCurrent: number;
  zoomNew: number;
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
  const centerRatio = {
    x:
      (-state.mapOffsets.x + state.containerSize.x / 2) /
      (MAP_SIZE_INIT.x * state.zoomCurrent),

    y:
      (-state.mapOffsets.y + state.containerSize.y / 2) /
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
