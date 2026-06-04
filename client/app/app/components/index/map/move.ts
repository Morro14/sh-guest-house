import type { MovableItem } from "~/types/map";
import { writeMapItemPosData } from "./utils";

interface Options {
  moveEnabled: boolean;
}
export default function getMapMoveHandlers(
  container: HTMLDivElement,
  map: HTMLDivElement,
  options: Options,
) {
  if (!map || !container) {
    return;
  }
  let mouseDownX: number, mouseDownY: number;
  let mapOffsetX: number = map.offsetLeft;
  let mapOffsetY: number = map.offsetTop;
  const activePointers = new Map();
  let isMovable = false;
  const handleMove = (e: PointerEvent) => {
    // if (activePointers.size > 1) {
    //   return;
    // }
    if (!isMovable) {
      return;
    }
    map.style.cursor = "grabbing";
    const deltaX = e.clientX - mouseDownX;
    const deltaY = e.clientY - mouseDownY;

    const minX = container.clientWidth - map.clientWidth;
    const minY = container.clientHeight - map.clientHeight;

    let newX = mapOffsetX + deltaX;
    let newY = mapOffsetY + deltaY;

    newX = Math.min(Math.max(newX, minX), 0);
    newY = Math.min(Math.max(newY, minY), 0);
    map.style.left = `${newX}px`;
    map.style.top = `${newY}px`;
  };
  const handlePointerDown = (e: PointerEvent) => {
    // add pointers
    activePointers.set(e.pointerId, e);
    isMovable = true;
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    mapOffsetX = map.offsetLeft;
    mapOffsetY = map.offsetTop;
  };
  const handlePointerUp = (e: PointerEvent) => {
    isMovable = false;
    map.style.cursor = "default";
    mapOffsetX = map.offsetLeft;
    mapOffsetY = map.offsetTop;
    // clear pointers
    activePointers.delete(e.pointerId);
    map.releasePointerCapture(e.pointerId);
  };
  return { handleMove, handlePointerDown, handlePointerUp };
}

export function useMoveLabel(
  container: HTMLDivElement,
  label: HTMLElement,
  type: MovableItem,
  options: Options,
) {
  if (!label || !container || !options.moveEnabled) {
    return;
  }
  let mouseDownX: number, mouseDownY: number;
  let labelOffsetX: number = label.offsetLeft;
  let labelOffsetY: number = label.offsetTop;
  const moveLabel = (e: PointerEvent) => {
    e.stopPropagation();
    label.style.cursor = "grabbing";
    const deltaX = e.clientX - mouseDownX;
    const deltaY = e.clientY - mouseDownY;

    const minX = -150;
    const minY = -150;

    let newX = labelOffsetX + deltaX;
    let newY = labelOffsetY + deltaY;

    newX = Math.max(Math.max(newX, minX), -150);
    newY = Math.max(Math.max(newY, minY), -150);
    label.style.left = `${newX}px`;
    label.style.top = `${newY}px`;
  };
  // console.log("useMovePlaceLabel", label, labelOptions, container);
  const registerMouseDownLabel = (e: PointerEvent) => {
    e.stopPropagation();
    // const target = e.target as Element;
    // const includeslabelElements = [label.id].includes(target.id);
    // if (!target.contains(label)) {
    //   console.log("not included");
    //   return;
    // }
    const currentSelection = window.getSelection();
    currentSelection.empty();

    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    labelOffsetX = label.offsetLeft;
    labelOffsetY = label.offsetTop;
    document.addEventListener("pointermove", moveLabel);
    document.addEventListener(
      "pointerup",
      () => {
        label.style.cursor = "default";
        document.removeEventListener("pointermove", moveLabel);
        labelOffsetX = label.offsetLeft;
        labelOffsetY = label.offsetTop;
        writeMapItemPosData(
          label.dataset.slug,
          { x: labelOffsetX, y: labelOffsetY },
          type,
        );
      },
      { once: true },
    );
  };
  if (options.moveEnabled) {
    label.addEventListener("pointerdown", registerMouseDownLabel);
  } else {
    label.removeEventListener("pointerdown", registerMouseDownLabel);
  }
}
