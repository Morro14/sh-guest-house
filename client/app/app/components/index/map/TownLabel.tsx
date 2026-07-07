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
  // move
  // useEffect(() => {
  //   if (!townLabel) {
  //     return;
  //   }
  //
  //   const labelEl = document.getElementById(townLabel.name) as HTMLDivElement;
  //   const container = document.getElementById(
  //     "map-container",
  //   ) as HTMLDivElement;
  //   useMoveLabel(container, labelEl, "townLabel", { moveEnabled: false });
  // }, [townLabel]);
  return townLabel ? (
    <div
      ref={ref}
      id={townLabel.name}
      style={{
        left: townLabel.offsets.x,
        top: townLabel.offsets.y,
        // scale: `${Math.floor((1 / context.zoom) * 100) / 100}`,
      }}
      className="absolute text-sm italic select-none map-text-shadow z-0"
    >
      {townLabel?.name
        ? townLabel.name.slice(0, 1).toUpperCase() + townLabel.name.slice(1)
        : ""}
    </div>
  ) : (
    ""
  );
}
