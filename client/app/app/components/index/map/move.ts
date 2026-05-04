import type { MapLabelOptions } from "~/types/map";
import { writePlaceLabelData } from "./utils";

interface Options {
  moveEnabled: boolean;
}
export default function useMoveMap(
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

  const move = (e: MouseEvent) => {
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
  const registerMouseDown = (e: MouseEvent) => {
    const target = e.target as Element;
    const includesMapElements = [
      "map-surface",
      "map-img",
      "map-labels",
      "map-content",
    ].includes(target.id);
    if (!includesMapElements) {
      return;
    }
    const currentSelection = window.getSelection();
    currentSelection.empty();
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    mapOffsetX = map.offsetLeft;
    mapOffsetY = map.offsetTop;
    document.addEventListener("mousemove", move);
    document.addEventListener(
      "mouseup",
      () => {
        map.style.cursor = "default";
        document.removeEventListener("mousemove", move);
        mapOffsetX = map.offsetLeft;
        mapOffsetY = map.offsetTop;
      },
      { once: true },
    );
  };
  if (options.moveEnabled) {
    map.addEventListener("mousedown", registerMouseDown);
  } else {
    map.removeEventListener("mousedown", registerMouseDown);
  }
}

export function useMovePlaceLabel(
  container: HTMLDivElement,
  label: HTMLDivElement,
  labelOptions: MapLabelOptions,
  options: Options,
) {
  if (!label || !container) {
    return;
  }
  let mouseDownX: number, mouseDownY: number;
  let labelOffsetX: number = label.offsetLeft;
  let labelOffsetY: number = label.offsetTop;

  const moveLabel = (e: MouseEvent) => {
    label.style.cursor = "grabbing";
    const deltaX = e.clientX - mouseDownX;
    const deltaY = e.clientY - mouseDownY;

    const minX = 0;
    const minY = 0;

    let newX = labelOffsetX + deltaX;
    let newY = labelOffsetY + deltaY;

    newX = Math.max(Math.max(newX, minX), 0);
    newY = Math.max(Math.max(newY, minY), 0);
    label.style.left = `${newX}px`;
    label.style.top = `${newY}px`;
  };
  // console.log("useMovePlaceLabel", label, labelOptions, container);
  const registerMouseDownLabel = (e: MouseEvent) => {
    const target = e.target as Element;
    console.log(target);
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
    document.addEventListener("mousemove", moveLabel);
    document.addEventListener(
      "mouseup",
      () => {
        label.style.cursor = "default";
        console.log("move label mouse up");
        document.removeEventListener("mousemove", moveLabel);
        labelOffsetX = label.offsetLeft;
        labelOffsetY = label.offsetTop;
        writePlaceLabelData(label.id, { x: labelOffsetX, y: labelOffsetY });
      },
      { once: true },
    );
  };
  if (options.moveEnabled) {
    label.addEventListener("mousedown", registerMouseDownLabel);
  } else {
    label.removeEventListener("mousedown", registerMouseDownLabel);
  }
}
