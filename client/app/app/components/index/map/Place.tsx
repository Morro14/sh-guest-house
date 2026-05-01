import { useTranslation } from "react-i18next";
import type { MapPlaceData, MapPlaceOptions } from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import type React from "react";

const defaultOptions: MapPlaceOptions = {
  offsets: { topOffset: 0, leftOffset: 0 },
  position: "absolute",
  contentPosition: "top",
  iconPosition: "top",
  dot: true,
};

export default function MapPlaceComponent({
  place,
  options = defaultOptions,
}: {
  place: MapPlaceData;
  options?: MapPlaceOptions;
}) {
  const optionsMerged = { ...defaultOptions, ...options };
  const { t } = useTranslation();
  const dot = <div className="size-2.5 rounded-[5px] bg-text-main mt-2"></div>;
  const context = useMapContextProvider();
  let mousePosOnClick = { x: 0, y: 0 };
  return (
    <div
      onClick={(e: React.MouseEvent) => {
        if (
          mousePosOnClick.x !== e.clientX &&
          mousePosOnClick.y !== e.clientY
        ) {
          return;
        }
        context.setPlaceSelected(place);
        context.setFullView(true);
      }}
      onMouseDown={(e: React.MouseEvent) => {
        mousePosOnClick = { x: e.clientX, y: e.clientY };
      }}
      className={`${optionsMerged.position} flex flex-col items-center hover:underline hover:cursor-pointer`}
      style={{
        top: `${optionsMerged.offsets.topOffset}px`,
        left: `${optionsMerged.offsets.leftOffset}px`,
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
