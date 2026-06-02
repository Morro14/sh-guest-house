import { useTranslation } from "react-i18next";
import type {
  Coords,
  MapPlaceData,
  MapLabelOptions,
  MapItemPosData,
} from "~/types/map";
import { useMapContextProvider } from "./MapContextProvider";
import { useEffect, useRef, useState } from "react";
import { useMoveLabel } from "./move";
import placeDotsPosData from "src/data/place-dots-data.json";
import { isClickNotDrag } from "./utils";

const defaultOptions: MapLabelOptions = {
  offsets: { x: 0, y: 0 },
  position: "absolute",
  dot: true,
  grouped: false,
};
const LABELS_WITHOUT_DOT = ["sevan", "yerevan"];
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
  const context = useMapContextProvider();
  const dotSize = { x: 12, y: 20 };
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const scaleLabelOffsets = (zoom: number, offsets: Coords) => {
    if (zoom < 0.5 || zoom > 2) {
      const labelEl = document.getElementById(
        `${place.slug}-place-label`,
      ) as HTMLDivElement;
      const currentOffsets = { x: labelEl.offsetLeft, y: labelEl.offsetTop };
      return { x: currentOffsets.x * zoom, y: currentOffsets.y * zoom };
    }
    const newX =
      (offsets.x + dotPos.x + dotSize.x / 2) * zoom - dotPos.x - dotSize.x / 2;
    const newY =
      (offsets.y + dotPos.y + dotSize.y) * zoom - dotPos.y - dotSize.y;
    return { x: Math.floor(newX), y: Math.floor(newY) };
  };

  const coordsScaled = !optionsMerged.group
    ? scaleLabelOffsets(context.zoom, optionsMerged.offsets)
    : { x: 0, y: 0 };
  // move
  // useEffect(() => {
  //   if (!place) {
  //     return;
  //   }
  //
  //   const labelEl = document.getElementById(
  //     `${place.slug}-place-label`,
  //   ) as HTMLDivElement;
  //   const container = document.getElementById(
  //     "map-container",
  //   ) as HTMLDivElement;
  //   const dotEl = document.getElementById(`${place.slug}-dot`);
  //   useMoveLabel(container, labelEl, "placeLabel", { moveEnabled: false });
  //   useMoveLabel(container, dotEl, "placeDot", { moveEnabled: false });
  // }, [place]);

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
  // const labelTranslate = {
  //   x: dotPos.x * context.zoom + Math.floor(dotSize / 2),
  //   y: dotPos.y * context.zoom + Math.floor(dotSize / 2),
  // };
  const hasDot =
    !optionsMerged.grouped &&
    optionsMerged.dot &&
    !LABELS_WITHOUT_DOT.includes(place.slug);
  let pointerPosOnMouseDown = { x: 0, y: 0 };
  return !place ? (
    <></>
  ) : (
    <div
      id={`${place.slug}-place-label`}
      data-slug={place.slug}
      key={`${place.slug}`}
      ref={ref}
      className={`select-none ${optionsMerged.position} text-shadow-2xs/100 text-shadow-white group text-black text-center
          font-medium place flex flex-col hover:cursor-pointer`}
      style={{
        left: `${coordsScaled.x}px`,
        top: `${coordsScaled.y}px`,
      }}
    >
      {/* <MapItemPosControl itemElRef={ref} dotElRef={dotRef}></MapItemPosControl> */}
      {hasDot ? (
        <div
          ref={dotRef}
          id={`${place.slug}-dot`}
          data-slug={place.slug}
          className="absolute"
          style={{ left: dotPos.x, top: dotPos.y }}
        >
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.74707 0C8.92112 0 11.4941 2.57302 11.4941 5.74707C11.494 8.92111 8.55154 13.4254 5.79297 20C3.03439 13.4254 9.85502e-05 8.92111 0 5.74707C0 2.57304 2.57305 2.98799e-05 5.74707 0ZM5.75 3.12598C4.35345 3.12598 3.22075 4.25776 3.2207 5.6543C3.2207 7.05088 4.35342 8.18359 5.75 8.18359C7.14647 8.18347 8.27832 7.0508 8.27832 5.6543C8.27827 4.25783 7.14644 3.1261 5.75 3.12598Z"
              fill="#4C3B33"
            />
          </svg>
        </div>
      ) : (
        ""
      )}
      <div className="text-center flex flex-col items-center">
        <div
          className="text-base hover:underline max-w-[154px] "
          onPointerDown={(e) => {
            pointerPosOnMouseDown = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            // click leeway
            const isClick = isClickNotDrag(pointerPosOnMouseDown, 5, e);
            console.log("click init", pointerPosOnMouseDown);
            console.log("click", isClick);
            if (!isClick) {
              return;
            }
            context.setFullView(true);
            context.setPlaceSelected(place);
          }}
        >
          {place.name}
        </div>
        <div className="text-sm">{`${place.distance} ${t("km", { context: "distance" })}`}</div>
      </div>
    </div>
  );
}
