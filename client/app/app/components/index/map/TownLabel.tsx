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
  // scale label
  useEffect(() => {
    if (!ref.current) return;
    if (context.zoom < 1) {
      ref.current.style.scale = `${context.zoom ** 0.5}`;
    } else {
      ref.current.style.scale = `${1.0}`;
    }
  }, []);
  return townLabel ? (
    <div
      ref={ref}
      id={townLabel.name}
      style={{
        left: townLabel.offsets.x,
        top: townLabel.offsets.y,
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
