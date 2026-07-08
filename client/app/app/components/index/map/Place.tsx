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
import { MAP_OPTIONS } from "./utils";
import MapItemPosControl from "./MapItemPosControl";

const defaultOptions: MapLabelOptions = {
  offsets: { x: 0, y: 0 },
  position: "absolute",
  dot: true,
  grouped: false,
};
const LABELS_WITHOUT_DOT = ["sevan", "yerevan"];
const PLACE_LABEL_STYLES = {
  fontSize: {
    1: "14px",
    2: "16px",
  },
  fill: {
    1: "black",
    2: "#404040",
  },
  color: {
    1: "black",
    2: "#404040",
  },
};
const DOT_STYLES = {
  scale: {
    1: 1,
    2: 0.8,
  },
  fill: {
    1: "black",
    2: "#404040",
  },
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
  const context = useMapContextProvider();
  const dotSize = { x: 12, y: 20 };
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
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
  //   useMoveLabel(container, dotEl, "placeDot", { moveEnabled: true });
  //   useMoveLabel(container, labelEl, "placeLabel", { moveEnabled: true });
  // }, [place]);
  const [anchor, setAnchor] = useState({ x: 50, y: 100 });
  useEffect(() => {
    if (!place) {
      return;
    }
    const dotData = placeDotsPosData.find(
      (item) => item.name === `${place.slug}`,
    ) as MapItemPosData;
    if (!ref.current) {
      return;
    }
    const w = ref.current.clientWidth;
    const h = ref.current.clientHeight;
    const anchor = {
      x: Math.floor(((dotData.offsets.x + dotSize.x / 2) / w) * 100),
      y: Math.floor(((dotData.offsets.y + dotSize.y) / h) * 100),
    };
    setAnchor(anchor);
    setDotPos(dotData.offsets);
  }, [place]);
  const getImportanceStyles = (element: "name" | "dot" = "name") => {
    let level = optionsMerged.importanceLevel;
    if (!optionsMerged.importanceLevel) {
      level = 1;
    }
    const styles = {};
    const stylesVars = {
      name: PLACE_LABEL_STYLES,
      dot: DOT_STYLES,
    };
    for (const [key, value] of Object.entries(stylesVars[element])) {
      styles[key] = value[level];
    }
    return styles;
  };
  const dotRef = useRef(null);
  const hasDot =
    !optionsMerged.grouped &&
    optionsMerged.dot &&
    !LABELS_WITHOUT_DOT.includes(place?.slug);
  // leeway
  let pointerPosOnMouseDown = { x: 0, y: 0 };

  return !place ? (
    <></>
  ) : (
    <div
      id={`${place.slug}-place-label`}
      data-slug={place.slug}
      ref={ref}
      className={`select-none ${optionsMerged.position} group text-black text-center
          font-medium place flex flex-col z-10`}
      style={{
        ...getImportanceStyles("name"),
        left: `${optionsMerged.offsets.x}px`,
        top: `${optionsMerged.offsets.y}px`,
        transformOrigin: `${anchor.x}% ${anchor.y}%`,
        // scale: `${Math.floor(Math.pow(1 / context.zoom, 0.8) * 100) / 100}`,
      }}
    >
      {/* <MapItemPosControl itemElRef={ref} dotElRef={dotRef}></MapItemPosControl> */}
      {hasDot ? (
        <div
          ref={dotRef}
          id={`${place.slug}-dot`}
          data-slug={place.slug}
          className="absolute"
          style={{
            left: dotPos.x,
            top: dotPos.y,
          }}
        >
          <svg
            width="12"
            height="19"
            viewBox="0 0 12 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:fill-primary! group-hover:stroke-primary"
            style={{ ...getImportanceStyles("dot") }}
          >
            <path d="M5.74707 0C8.92112 0 11.4941 2.57302 11.4941 5.74707C11.4941 8.55639 9.18953 12.4078 6.74707 17.8145C6.3821 18.6223 5.20392 18.6224 4.83691 17.8154C2.3777 12.4082 8.72326e-05 8.5566 0 5.74707C0 2.57304 2.57305 2.98799e-05 5.74707 0ZM5.75 3.12598C4.35345 3.12598 3.22075 4.25776 3.2207 5.6543C3.2207 7.05088 4.35342 8.18359 5.75 8.18359C7.14647 8.18347 8.27832 7.0508 8.27832 5.6543C8.27827 4.25783 7.14644 3.1261 5.75 3.12598Z" />
          </svg>
        </div>
      ) : (
        ""
      )}
      <div
        className="text-center flex flex-col items-center"
        onPointerDown={(e) => {
          pointerPosOnMouseDown = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          // click leeway
          const isClick = isClickNotDrag(pointerPosOnMouseDown, 5, e);
          if (!isClick) {
            return;
          }
          context.setFullView(true);
          context.setPlaceSelected(place);
        }}
      >
        <div
          className={`text-base/5 hover:underline hover:cursor-pointer max-w-[154px] font-[600] map-text-shadow`}
        >
          {place.name}
        </div>
        <div className="text-sm">
          {t("km", { context: "distance", count: place.distance })}
        </div>
      </div>
    </div>
  );
}
