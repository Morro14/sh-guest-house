import type { Coords } from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import { useEffect, useRef } from "react";
import { useMoveLabel } from "./move";

export default function TownLabel({
  townLabel,
}: {
  townLabel: { name: string; offsets: Coords };
}) {
  const context = useMapContextProvider();
  const ref = useRef(null);
  const scaleLabelOffsets = (zoom: number, offsets: Coords) => {
    // if (zoom < 0.5 || zoom > 2) {
    //   const labelEl = ref.current;
    //   const currentOffsets = { x: labelEl.offsetLeft, y: labelEl.offsetTop };
    //   if (townLabel.name === "getap") {
    //   }
    //   return { x: currentOffsets.x * zoom, y: currentOffsets.y * zoom };
    // }
    const newX = Math.floor(offsets.x * zoom);
    const newY = Math.floor(offsets.y * zoom);
    return { x: newX, y: newY };
  };
  const coordsScaled = scaleLabelOffsets(context.zoom, townLabel.offsets);
  // move
  useEffect(() => {
    if (!townLabel) {
      return;
    }

    const labelEl = document.getElementById(townLabel.name) as HTMLDivElement;
    const container = document.getElementById(
      "map-container",
    ) as HTMLDivElement;
    useMoveLabel(container, labelEl, "townLabel", { moveEnabled: true });
  }, [townLabel]);
  // scale label
  useEffect(() => {
    if (!ref.current) return;
    if (context.zoom < 1) {
      ref.current.style.scale = `${context.zoom ** 0.5}`;
    } else {
      ref.current.style.scale = `${1.0}`;
    }
  }, [coordsScaled]);
  return townLabel ? (
    <div
      ref={ref}
      id={townLabel.name}
      style={{
        left: coordsScaled.x,
        top: coordsScaled.y,
      }}
      className="absolute text-sm italic select-none map-text-shadow"
    >
      {townLabel?.name
        ? townLabel.name.slice(0, 1).toUpperCase() + townLabel.name.slice(1)
        : ""}
    </div>
  ) : (
    ""
  );
}
