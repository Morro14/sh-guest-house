import type { Dispatch, SetStateAction } from "react";
import type { MapZoom } from "~/types/map";
import { zoomMap } from "./zoom";

export function usePinchZoom({
  mapSurface,
  mapContent,
  container,
  currentZoom,
  setZoom,
}: {
  mapSurface: HTMLDivElement;
  mapContent: HTMLDivElement;
  container: HTMLDivElement;
  currentZoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
}) {
  const activePointers = new Map();
  let initPointers = new Map();
  let initDistance = 1;
  let prevDistance = -1;
  const handlePointerDown = (e) => {
    activePointers.set(e.pointerId, e);
    mapSurface.setPointerCapture(e.pointerId);
    if (activePointers.size === 2) {
      const [p1, p2] = Array.from(activePointers.values());

      const dx = p1.clientX - p2.clientX;
      const dy = p1.clientY - p2.clientY;
      initPointers.set(p1, { x: e.clientX, y: e.clientY });
      initPointers.set(p2, { x: e.clientX, y: e.clientY });
      initDistance = Math.sqrt(dx * dx + dy * dy);
    }
  };
  const handleMove = (e) => {
    if (!activePointers.has(e.pointerId)) return;
    // activePointers.set(e.pointerId, e);
    // test with pointer size 2 instead of 1
    if (activePointers.size >= 2) {
      const [p1, p2] = Array.from(activePointers.values());

      const dx = p1.clientX - p2.clientX;
      const dy = p1.clientY - p2.clientY;
      const pinchCenter = {
        x: Math.floor(p1.clientX + dx / 2),
        y: Math.floor(p1.clientY + dy / 2),
      };
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const zoomFactor = 0.1;
      const scaleMultiplier = currentDistance / initDistance;
      if (prevDistance > 0) {
        if (currentDistance > prevDistance) {
          const newZoom = currentZoom * scaleMultiplier;
          zoomMap({
            container: container,
            mapSurface: mapSurface,
            mapContent: mapContent,
            currentZoom: currentZoom,
            newZoom: newZoom,
            // TODO get relative center
            pinchCenter: pinchCenter,
          });
          setZoom(newZoom);
        } else if (currentDistance < prevDistance) {
          const newZoom = currentZoom * scaleMultiplier;
          zoomMap({
            container: container,
            mapSurface: mapSurface,
            mapContent: mapContent,
            currentZoom: currentZoom,
            newZoom: newZoom,
            // TODO get relative center
            pinchCenter: pinchCenter,
          });
          setZoom(newZoom);
        }

        // const newZoom = currentZoom * scaleMultiplier;
        // console.log("new zoom", newZoom);
        // callback({ container, mapSurface, mapContent, currentZoom, newZoom });
      }

      prevDistance = currentDistance;
    }
  };

  const stopTracking = (e: PointerEvent) => {
    // test
    // if (activePointers.size > 2) {
    //   activePointers.delete(e.pointerId);
    // }
    activePointers.delete(e.pointerId);
    mapSurface.releasePointerCapture(e.pointerId);
    // test size <= 2 instead of < 2
    if (activePointers.size < 2) {
      prevDistance = -1;
    }
  };

  // mapSurface.addEventListener("pointerup", stopTracking);
  // mapSurface.addEventListener("pointercancel", stopTracking);
  return { stopTracking, handleMove, handlePointerDown };
}
