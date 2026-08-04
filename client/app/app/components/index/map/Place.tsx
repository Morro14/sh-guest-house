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

const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;
const defaultOptions: MapLabelOptions = {
  offsets: { x: 0, y: 0 },
  position: "absolute",
  dot: true,
  grouped: false,
  interactive: true,
};
const LABELS_WITHOUT_DOT = ["sevan", "yerevan"];
const PLACE_LABEL_STYLES = {
  fontSize: {
    1: "16px",
    2: "14px",
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
  const dotSize = { x: 40, y: 55 };
  // const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
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
  //   // const dotEl = document.getElementById(`${place.slug}-dot`);
  //   // useMoveLabel(container, dotEl, "placeDot", { moveEnabled: true });
  //   useMoveLabel(container, labelEl, "placeLabel", { moveEnabled: true });
  // }, [place]);
  const [anchor, setAnchor] = useState({ x: 50, y: 100 });
  // const anchor = { x: Math.floor(dotSize.x / 2), y: Math.floor(dotSize.y) };
  if (place?.slug === "tanaat") {
  }
  useEffect(() => {
    if (!place) {
      return;
    }
    if (!ref.current) {
      return;
    }
    const w = ref.current.clientWidth;
    const h = ref.current.clientHeight;
    const anchor = {
      x: Math.floor((dotSize.x / 2 / w) * 100),
      y: Math.floor((dotSize.y / h) * 100),
    };
    setAnchor(anchor);
  }, [place]);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.scale = `${Math.min(1, 1 / context.zoom)}`;
  }, [context.zoom]);
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
          font-medium place flex ${optionsMerged.labelOrientation === "left" ? "flex-row-reverse" : ""} gap-1 z-10`}
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
          className="relative"
        >
          <div
            className={`absolute z-50  w-[36px] h-[36px] rounded-[20px] left-[2px] top-[2px]`}
            style={{
              backgroundImage: `url(${MEDIA_BASE_URL + place.images[0]?.variants.small})`,
              backgroundSize: "cover",
            }}
          />
          <svg
            width="40"
            className={`drop-shadow ${optionsMerged.pinOrientation === "reversed" ? "rotate-180" : ""}`}
            height="55"
            viewBox="0 0 40 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40 19.7753C40 30.6969 29.375 48.8202 20 55C9.375 48.8202 0 30.6969 0 19.7753C0 8.85369 8.9543 0 20 0C31.0457 0 40 8.85369 40 19.7753Z"
              fill="white"
            />
          </svg>
        </div>
      ) : (
        ""
      )}
      <div
        className={`${optionsMerged.labelOrientation === "left" ? "text-right" : "text-left"}`}
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
          className={`leading-5 font-serif bg-transparent rounded font-[600] ${optionsMerged.interactive ? "underline hover:cursor-pointer" : ""} max-w-[154px] map-text-shadow px-1 py-1`}
        >
          {place.name}
        </div>
        <div className="text-sm font-serif bg-transparent rounded px-1">
          {t("km", { context: "distance", count: place.distance })}
        </div>
      </div>
    </div>
  );
}
