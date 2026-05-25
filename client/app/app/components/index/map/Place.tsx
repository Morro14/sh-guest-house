import { useTranslation } from "react-i18next";
import type { Coords, MapPlaceData, MapLabelOptions } from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import type React from "react";
import { useEffect, useRef } from "react";

const defaultOptions: MapLabelOptions = {
  offsets: { x: 0, y: 0 },
  position: "absolute",
  contentPosition: "top",
  iconPosition: "top",
  dot: true,
  grouped: false,
};

export default function MapPlaceComponent({
  place,
  options = defaultOptions,
}: {
  place: MapPlaceData;
  options?: MapLabelOptions;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const optionsMerged = { ...defaultOptions, ...options };
  const { t } = useTranslation();
  const dot = (
    <div className="size-2.5 rounded-[5px] bg-text-main mt-2 mb-1"></div>
  );
  const context = useMapContextProvider();
  const startPos = { x: 0, y: 0 };
  const scaleLabelOffsets = (zoom: number, offsets: Coords) => {
    const newX = Math.floor(offsets.x * zoom);
    const newY = Math.floor(offsets.y * zoom);
    return { x: newX, y: newY };
  };
  const coordsScaled = scaleLabelOffsets(context.zoom, optionsMerged.offsets);
  // move
  // useEffect(() => {
  //   if (!place) {
  //     return;
  //   }
  //
  //   const labelEl = document.getElementById(place.slug) as HTMLDivElement;
  //   const container = document.getElementById(
  //     "map-container",
  //   ) as HTMLDivElement;
  //   useMovePlaceLabel(container, labelEl, optionsMerged, { moveEnabled: true });
  // }, [place]);
  useEffect(() => {
    const element = ref.current;
    if (!ref.current) {
      return;
    }
    const handlePointerDown = (e: PointerEvent) => {
      console.log("place pointerdown");
      e.preventDefault();
      startPos.x = e.clientX;
      startPos.y = e.clientY;
      // e.stopPropagation();
    };
    const handlePointerUp = (e: PointerEvent) => {
      console.log("place pointerup");
      const moved =
        Math.abs(startPos.x - e.clientX) > 5 ||
        Math.abs(startPos.y - e.clientY) > 5;
      if (moved) {
        return;
      }
      console.log("opening place details");
      context.setPlaceSelected(place);
      context.setFullView(true);
    };

    element.addEventListener("pointerdown", handlePointerDown);
    element.addEventListener("pointerup", handlePointerUp);
    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      element.removeEventListener("pointerup", handlePointerUp);
    };
  });
  //
  //
  return (
    <div
      id={`${place.slug}`}
      key={`${place.slug}`}
      ref={ref}
      className={`${optionsMerged.position} place flex flex-col items-center hover:underline hover:cursor-pointer ${!optionsMerged.grouped ? "-translate-x-1/2" : ""} ${optionsMerged.contentPosition === "top" && !optionsMerged.grouped ? "-translate-y-9/10" : !optionsMerged.grouped ? "-translate-y-[7px]" : ""}`}
      style={{
        left: `${coordsScaled.x}px`,
        top: `${coordsScaled.y}px`,
      }}
    >
      {optionsMerged.contentPosition === "bottom" && optionsMerged.dot
        ? dot
        : ""}

      <div className="text-lg font-medium">{place.name}</div>
      <div className="text-sm">{`${place.distance} ${t("km", { context: "distance" })}`}</div>
      {optionsMerged.contentPosition === "top" && optionsMerged.dot ? dot : ""}
    </div>
  );
}
