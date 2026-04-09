import { useTranslation } from "react-i18next";
import type { MapPlaceData, MapPlaceOptions } from "~/types/map";

const defaultOptions: MapPlaceOptions = {
  position: { topOffset: 0, leftOffset: 0 },
  contentPosition: "top",
  iconPosition: "top",
};

export default function MapPlaceComponent({
  place,
  options = defaultOptions,
}: {
  place: MapPlaceData;
  options?: MapPlaceOptions;
}) {
  const { t } = useTranslation();
  const dot = <div className="size-2.5 rounded-[5px] bg-text-main mt-2"></div>;
  return (
    <div
      className={`absolute flex flex-col items-center`}
      style={{
        top: `${options.position.topOffset}px`,
        left: `${options.position.leftOffset}px`,
      }}
    >
      {options.contentPosition === "bottom" ? dot : ""}

      <div className="text-lg">{place.name}</div>
      <div className="">{`${place.distance} ${t("km", { context: "distance" })}`}</div>
      {options.contentPosition === "top" ? dot : ""}
    </div>
  );
}
