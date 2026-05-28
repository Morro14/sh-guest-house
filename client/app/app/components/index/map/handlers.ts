import type { MapElements } from "~/types/map";
import { zoomMap } from "./zoom";

export function getMapHandlers(elements: MapElements, context: any) {
  const { mapSurface, mapContainer, mapContent } = elements;
  let mouseDownX: number, mouseDownY: number;
  let mapOffsetX: number = mapSurface.offsetLeft;
  let mapOffsetY: number = mapSurface.offsetTop;
  let isMovable = false;

  // pinch
  const activePointers = new Map();
  // let initPointers = new Map();
  let initDistance = 70;
  let prevDistance = -1;

  function handlePointerDown(e: PointerEvent) {
    // map pointer down
    console.log("map pointer down");
    isMovable = true;
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    mapOffsetX = mapSurface.offsetLeft;
    mapOffsetY = mapSurface.offsetTop;
    // pinch
    activePointers.set(e.pointerId, e);
    if (activePointers.size === 2) {
      const [p1, p2] = Array.from(activePointers.values());
      const dx = p1.clientX - p2.clientX;
      const dy = p1.clientY - p2.clientY;
      initDistance = Math.sqrt(dx * dx + dy * dy);
    }
  }
  function handleMapMove(e: PointerEvent) {
    if (!isMovable) {
      return;
    }
    // const [p1] = Array.from(activePointers.keys());
    // console.log("move");
    if (!e.isPrimary) {
      return;
    }
    mapSurface.style.cursor = "grabbing";
    const deltaX = e.clientX - mouseDownX;
    const deltaY = e.clientY - mouseDownY;

    const minX = mapContainer.clientWidth - mapSurface.clientWidth;
    const minY = mapContainer.clientHeight - mapSurface.clientHeight;

    let newX = mapOffsetX + deltaX;
    let newY = mapOffsetY + deltaY;

    newX = Math.min(Math.max(newX, minX), 0);
    newY = Math.min(Math.max(newY, minY), 0);
    mapSurface.style.left = `${newX}px`;
    mapSurface.style.top = `${newY}px`;
  }

  function handlePinchMove(e: PointerEvent) {
    if (!isMovable) {
      return;
    }
    // console.log("pinch move");
    const currentZoom = context.zoom;
    const setZoom = context.setZoom;
    if (!activePointers.has(e.pointerId)) {
      return;
    }

    activePointers.set(e.pointerId, e);
    if (activePointers.size === 2) {
      const [p1, p2] = Array.from(activePointers.values());

      const dx = p1.clientX - p2.clientX;
      const dy = p1.clientY - p2.clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      console.log("pointer", p1);
      const pinchCenter = {
        x: Math.floor(p1.clientX + dx / 2),
        y: Math.floor(p1.clientY + dy / 2),
      };
      // const zoomFactor = 0.1;
      const scaleMultiplier = currentDistance / initDistance;
      // console.log(
      //   "initDistance",
      //   initDistance,
      //   "currentDistance",
      //   currentDistance,
      // );
      if (prevDistance > 0) {
        if (currentDistance > prevDistance) {
          const newZoom = currentZoom * scaleMultiplier;
          zoomMap({
            container: mapContainer,
            mapSurface: mapSurface,
            mapContent: mapContent,
            currentZoom: currentZoom,
            newZoom: newZoom,
            pinchCenter: pinchCenter,
          });
          setZoom(newZoom);
        } else if (currentDistance < prevDistance) {
          const newZoom = currentZoom * scaleMultiplier;
          zoomMap({
            container: mapContainer,
            mapSurface: mapSurface,
            mapContent: mapContent,
            currentZoom: currentZoom,
            newZoom: newZoom,
            pinchCenter: pinchCenter,
          });
          setZoom(newZoom);
        }

        // const newZoom = currentZoom * scaleMultiplier;
        // console.log("new zoom", newZoom);
        // callback({ mapContainer, mapSurface, mapContent, currentZoom, newZoom });
      }

      prevDistance = currentDistance;
    }
  }
  function handleMapPointerUp(e: PointerEvent) {
    isMovable = false;
    mapSurface.style.cursor = "default";
    mapOffsetX = mapSurface.offsetLeft;
    mapOffsetY = mapSurface.offsetTop;
    // clear pointers
    activePointers.delete(e.pointerId);
    // mapSurface.releasePointerCapture(e.pointerId);
    //pinch
  }
  function handlePinchPointerUp(e: PointerEvent) {
    // activePointers.delete(e.pointerId);
    // mapSurface.releasePointerCapture(e.pointerId);
    if (activePointers.size < 2) {
      prevDistance = -1;
    }
  }
  return {
    handlePointerDown,
    handlePinchMove,
    handleMapMove,
    handleMapPointerUp,
    handlePinchPointerUp,
  };
}
