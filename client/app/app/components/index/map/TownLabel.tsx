import type { Coords } from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import { useEffect } from "react";
import { useMoveLabel } from "./move";

export default function TownLabel({
  townLabel,
}: {
  townLabel: { name: string; offsets: Coords };
}) {
  const context = useMapContextProvider();
  const scaleLabelOffsets = (zoom: number, offsets: Coords) => {
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
    useMoveLabel(container, labelEl, "townLabel", { moveEnabled: true });
  }, [townLabel]);
  // console.log(townLabel.name, townLabel.offsets);
  return (
    <div
      id={townLabel.name}
      style={{ left: coordsScaled.x, top: coordsScaled.y }}
      className="absolute text-sm italic select-none capitalize"
    >
      {townLabel.name}
    </div>
  );
}
