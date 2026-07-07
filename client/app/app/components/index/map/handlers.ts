import type { MapElements } from "~/types/map";
import { zoomMap } from "./zoom";
import { boundMapPos, getAnchorRatio, MAP_OPTIONS } from "./utils";

export function getMapHandlers(elements: MapElements, context: any) {
  const { mapSurface, mapContainer, mapContent } = elements;
  let mouseDownX: number, mouseDownY: number;
  let mapOffsetX: number = mapSurface.offsetLeft;
  let mapOffsetY: number = mapSurface.offsetTop;
  let isMovable = true;
  // let currentZoom = context.zoom;
  // pinch
  const activePointers = new Map();
  // pointer for pinch test
  // const testPointerEvent = new PointerEvent("pointerdown", {
  //   bubbles: true,
  //   cancelable: true,
  //   pointerId: 1,
  //   pointerType: "touch",
  //   clientX: 1000,
  //   clientY: 800,
  //   pressure: 0.5,
  // });
  // mapSurface.dispatchEvent(testPointerEvent);
  // activePointers.set(testPointerEvent.pointerId, testPointerEvent);
  // let lastPointer = null;
  let distanceInit = -1;
  // bound map position
  let mapSurfaceOffsetX =
    -mapSurface.clientWidth / 2 + mapContainer.clientWidth / 2;
  let mapSurfaceOffsetY =
    -mapSurface.clientHeight / 2 + mapContainer.clientHeight / 2;
  let minY = Math.floor(mapSurfaceOffsetY - mapContent.clientHeight / 2);
  let maxY = Math.floor(mapSurfaceOffsetY + mapContent.clientHeight / 2);
  let minX = Math.floor(mapSurfaceOffsetX - mapContent.clientWidth / 2);
  let maxX = Math.floor(mapSurfaceOffsetX + mapContent.clientWidth / 2);
  // map anchor relative to container
  let anchor = {
    x: mapContainer.clientWidth / 2,
    y: mapContainer.clientHeight / 2,
  };
  // anchor ratio relative to the map surface
  let anchorRatios = getAnchorRatio(mapContainer, mapSurface);
  let zoomCurrent = 1;
  const mapConsole = document.getElementById("map-console");
  function handlePointerDown(e: PointerEvent) {
    // map pointer down
    e.preventDefault();
    isMovable = true;
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    mapOffsetX = mapSurface.offsetLeft;
    mapOffsetY = mapSurface.offsetTop;
    mapSurfaceOffsetY =
      -mapSurface.clientHeight / 2 + mapContainer.clientHeight / 2;
    mapSurfaceOffsetX =
      -mapSurface.clientWidth / 2 + mapContainer.clientWidth / 2;
    minY = Math.floor(mapSurfaceOffsetY - mapContent.clientHeight / 2);
    maxY = Math.floor(mapSurfaceOffsetY + mapContent.clientHeight / 2);
    minX = Math.floor(mapSurfaceOffsetX - mapContent.clientWidth / 2);
    maxX = Math.floor(mapSurfaceOffsetX + mapContent.clientWidth / 2);
    // anchorRatios = getAnchorRatio(mapContainer, mapSurface);
    // pinch
    if (activePointers.size < 2) {
      activePointers.set(e.pointerId, e);
      // if (activePointers.size > 2) {
      //   activePointers.delete(lastPointer.pointerId);
      //   lastPointer = e;
      // }
      // if (activePointers.size === 1) {
      // lastPointer = e;
      //   return;
      // }
      if (activePointers.size === 2) {
        const [p1, p2] = Array.from(activePointers.values());
        const dx = p2.clientX - p1.clientX;
        const dy = p2.clientY - p1.clientY;
        zoomCurrent = context.current.zoom;
        distanceInit = Math.sqrt(dx * dx + dy * dy);
        anchor = {
          x: Math.floor(
            p1.clientX + dx / 2 - mapContainer.getBoundingClientRect().x,
          ),
          y: Math.floor(
            p1.clientY + dy / 2 - mapContainer.getBoundingClientRect().y,
          ),
        };
        anchorRatios = getAnchorRatio(mapContainer, mapSurface, anchor);
      }
      // lastPointer = e;
    }
  }

  function handleMapMove(e: PointerEvent) {
    if (!isMovable) {
      return;
    }
    // const [p1] = Array.from(activePointers.keys());
    if (!e.isPrimary) {
      return;
    }
    if (activePointers.size > 1) {
      return;
    }
    mapSurface.style.cursor = "grabbing";
    const deltaX = e.clientX - mouseDownX;
    const deltaY = e.clientY - mouseDownY;

    let newX = mapOffsetX + deltaX;
    let newY = mapOffsetY + deltaY;

    const boundCoords = boundMapPos(
      mapSurface,
      mapContent,
      { x: mapContainer.clientWidth, y: mapContainer.clientHeight },
      { x: newX, y: newY },
      context.current.zoom,
    );
    mapSurface.style.left = `${boundCoords.x}px`;
    mapSurface.style.top = `${boundCoords.y}px`;
  }
  function handleWheel(e: WheelEvent) {
    const wheelDir = -(e.deltaY / Math.abs(e.deltaY));
    let newScale = context.current.zoom + 0.2 * wheelDir;
    newScale = Math.max(
      MAP_OPTIONS.zoomMin,
      Math.min(MAP_OPTIONS.zoomMax, newScale),
    );

    anchor = {
      x: Math.floor(e.clientX - mapContainer.getBoundingClientRect().x),
      y: Math.floor(e.clientY - mapContainer.getBoundingClientRect().y),
    };
    anchorRatios = getAnchorRatio(mapContainer, mapSurface, anchor);

    zoomMap({
      mapSurface,
      mapContainer,
      mapContent,
      zoomNew: newScale,
      anchorRatio: anchorRatios,
      anchor: anchor,
    });
    context.current.setZoom(newScale);
  }
  function handlePinchMove(e: PointerEvent) {
    activePointers.set(e.pointerId, e);

    if (activePointers.size === 2) {
      requestAnimationFrame(() => {
        // mapConsole.innerHTML = String(activePointers.size);
        const [p1, p2] = Array.from(activePointers.values());
        const dx = p1.clientX - p2.clientX;
        const dy = p1.clientY - p2.clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        const distanceChange = currentDistance / distanceInit;
        let newScale = zoomCurrent * distanceChange;
        newScale = Math.max(
          MAP_OPTIONS.zoomMin,
          Math.min(MAP_OPTIONS.zoomMax, newScale),
        );
        // if (!frameRequested) {
        // requestAnimationFrame(() => {
        zoomMap({
          mapSurface,
          mapContainer,
          mapContent,
          zoomNew: newScale,
          anchorRatio: anchorRatios,
          anchor: anchor,
        });
        // });
        // }
        context.current.setZoom(newScale);
      });
    }
  }

  function handleMapPointerUp(e: PointerEvent) {
    isMovable = false;
    mapSurface.style.cursor = "move";
    mapOffsetX = mapSurface.offsetLeft;
    mapOffsetY = mapSurface.offsetTop;
    // clear pointers
    activePointers.delete(e.pointerId);
    mapSurface.releasePointerCapture(e.pointerId);
    //pinch
  }
  function handlePinchPointerUp(e: PointerEvent) {
    distanceInit = -1;
    // zoomCurrentLocal = Number(mapSurface.style.scale);
    // const transformX = -mapContainer.clientWidth / 2 + anchor.x;
    // const transformY = -mapContainer.clientHeight / 2 + anchor.y;
    // mapSurface.style.transformOrigin = `center`;
    // if (activePointers.size > 1) {
    //   activePointers.delete(e.pointerId);
    //   mapSurface.releasePointerCapture(e.pointerId);
    // }
  }
  return {
    handlePointerDown,
    handlePinchMove,
    handleMapMove,
    handleMapPointerUp,
    handlePinchPointerUp,
    handleWheel,
  };
}
