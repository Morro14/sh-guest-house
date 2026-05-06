import type { ReactNode } from "react";
import type { Coords } from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
export default function MapLabelGroup({
  children,
  offsets,
}: {
  children: ReactNode;
  offsets: Coords;
}) {
  const context = useMapContextProvider();
  const scaleLabelGroupOffsets = (zoom: number, offsets: Coords) => {
    const newX = Math.floor(offsets.x * zoom);
    const newY = Math.floor(offsets.y * zoom);
    return { x: newX, y: newY };
  };
  const offsetsScaled = scaleLabelGroupOffsets(context.zoom, offsets);
  return (
    <div
      className={`absolute flex flex-col items-center w-fit -translate-y-full`}
      style={{ left: offsetsScaled.x, top: offsetsScaled.y }}
    >
      {children}
    </div>
  );
}
