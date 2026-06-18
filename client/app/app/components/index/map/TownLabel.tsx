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
  useEffect(() => {
    if (!townLabel) {
      return;
    }

    const labelEl = document.getElementById(townLabel.name) as HTMLDivElement;
    const container = document.getElementById(
      "map-container",
    ) as HTMLDivElement;
    useMoveLabel(container, labelEl, "townLabel", { moveEnabled: false });
  }, [townLabel]);
  // console.log(townLabel.name, townLabel.offsets);
  return (
    <div
      ref={ref}
      id={townLabel.name}
      style={{
        left: coordsScaled.x,
        top: coordsScaled.y,
        textTransform: "capitalize",
      }}
      className="absolute text-sm italic select-none capitalize"
    >
      {townLabel.name}
    </div>
  );
}
