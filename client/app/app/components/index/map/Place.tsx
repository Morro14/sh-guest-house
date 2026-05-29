import { useTranslation } from "react-i18next";
import type {
  Coords,
  MapPlaceData,
  MapLabelOptions,
  MapLabelPosData,
  MapItemPosData,
} from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import { useEffect, useRef, useState } from "react";
import { useMoveLabel } from "./move";
import placeDotsPosData from "src/data/place-dots-data.json";
import MapItemPosControl from "./MapItemPosControl";

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
  <div className="size-2.5 rounded-[5px] bg-text-main mt-2 mb-1"></div>;
  const context = useMapContextProvider();
  const scaleLabelOffsets = (zoom: number, offsets: Coords) => {
    const newX = Math.floor(offsets.x * zoom);
    const newY = Math.floor(offsets.y * zoom);
    return { x: newX, y: newY };
  };
  const coordsScaled = scaleLabelOffsets(context.zoom, optionsMerged.offsets);
  // move
  useEffect(() => {
    if (!place) {
      return;
    }

    const labelEl = document.getElementById(
      `${place.slug}-place-label`,
    ) as HTMLDivElement;
    const container = document.getElementById(
      "map-container",
    ) as HTMLDivElement;
    const dotEl = document.getElementById(`${place.slug}-dot`);
    useMoveLabel(container, labelEl, "placeLabel", { moveEnabled: true });
    useMoveLabel(container, dotEl, "placeDot", { moveEnabled: true });
    // const placeLabelAnchor = getPlaceLabelAnchor(dotPos, labelEl);
  }, [place]);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!place) {
      return;
    }
    const dotData = placeDotsPosData.find(
      (item) => item.name === `${place.slug}`,
    ) as MapItemPosData;
    setDotPos(dotData.offsets);
  }, [place]);
  const dotRef = useRef(null);
  return !place ? (
    <></>
  ) : (
    <div
      id={`${place.slug}-place-label`}
      data-slug={place.slug}
      key={`${place.slug}`}
      ref={ref}
      className={`select-none ${optionsMerged.position} text-shadow-2xs/100 text-shadow-white group text-black text-center font-medium place flex flex-col hover:cursor-pointer  ${!optionsMerged.grouped ? "-translate-x-1/2" : ""} ${optionsMerged.contentPosition === "top" && !optionsMerged.grouped ? "-translate-y-9/10" : !optionsMerged.grouped ? "-translate-y-[7px]" : ""}`}
      style={{
        left: `${coordsScaled.x}px`,
        top: `${coordsScaled.y}px`,
      }}
    >
      <MapItemPosControl itemElRef={ref} dotElRef={dotRef}></MapItemPosControl>
      <div
        ref={dotRef}
        id={`${place.slug}-dot`}
        data-slug={place.slug}
        className="absolute stroke-black fill-black group-hover:animate-pulse transition-all"
        style={{ left: dotPos.x, top: dotPos.y }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          className="fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5.5" cy="5.5" r="2" />
          <circle cx="5.5" cy="5.5" r="5" />
        </svg>
      </div>
      <div className="text-center flex flex-col items-center">
        <div className="text-base underline max-w-[154px] ">{place.name}</div>
        <div className="text-sm">{`${place.distance} ${t("km", { context: "distance" })}`}</div>
      </div>
    </div>
  );
}
function getPlaceLabelAnchor(dotPos: Coords, labelEl: HTMLDivElement) {
  return;
}
