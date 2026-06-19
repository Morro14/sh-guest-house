import type { MovableItem } from "~/types/map";
import { writeMapItemPosData } from "./utils";

interface Options {
  moveEnabled: boolean;
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
    console.log("label mouse down");
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
