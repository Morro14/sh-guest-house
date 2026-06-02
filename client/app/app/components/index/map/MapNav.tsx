import { useTranslation } from "react-i18next";
import { useMapContextProvider } from "./MapContextProvider";
import { zoomMap } from "./zoom";
import mountainsIcon from "src/assets/mountains-icon.png";
import houseIcon from "src/assets/house-icon.png";

export default function MapNav({
  mapSurface,
  container,
  mapImage,
  mapContent,
}: {
  mapSurface: HTMLDivElement;
  container: HTMLDivElement;
  mapContent: HTMLDivElement;
  mapImage: HTMLImageElement;
}) {
  const context = useMapContextProvider();
  const currentZoom = context.zoom;
  const zoomFactor = 0.3;
  const { t } = useTranslation();
  const LEGEND = {
    normalRoad: { name: t("Normal road"), icon: normalRoadSVG, type: "line" },
    dirtRoad: { name: t("Dirt road"), icon: dirtRoadSVG, type: "line" },
    offRoad: {
      name: t("Dirt road (off-road car required"),
      icon: offRoadSVG,
      type: "line",
    },
    hikingTrail: {
      name: t("Hiking trail"),
      icon: hikingTrailSVG,
      type: "line",
    },
    mainRoad: { name: t("Republican road"), icon: mainRoadSVG, type: "line" },
    river: { name: t("River"), icon: riverSVG, type: "line" },
    mountains: {
      name: t("Mountainous terain"),
      icon: mountainsIcon,
      type: "line",
    },
    house: { name: t("Shushan guest-house"), icon: houseIcon, type: "line" },
    pin: { name: t("Point of interest"), icon: pinSVG, type: "icon" },
  };
  return (
    <div className="flex justify-between mb-4">
      {/* {context.mapPos ? ( */}
      {/*   <div className="font-sans">{`${context.mapPos.x} ${context.mapPos.y}`}</div> */}
      {/* ) : ( */}
      {/*   "" */}
      {/* )} */}
      <div className="grid grid-flow-col gap-x-6 gap-y-1 grid-rows-[repeat(3,minmax(min-content,1fr))]">
        {Object.entries(LEGEND).map(([key, value]) => (
          <div className="flex items-center gap-4">
            {typeof value.icon !== "string" ? (
              <div className={`w-15 h-5 flex items-center justify-end`}>
                {value.icon}
              </div>
            ) : (
              <div className={`w-15 h-5 flex items-center justify-end`}>
                <img src={value.icon} className="h-full object-contain" />
              </div>
            )}
            <span className="text-sm font-sans">{value.name}</span>
          </div>
        ))}
      </div>

      <div className="space-x-8 text-5xl">
        <button
          className="bg-gray-warm-light size-12"
          onClick={() => {
            const newZoom = currentZoom - zoomFactor;
            if (newZoom <= 1) {
              return;
            }
            zoomMap({
              container,
              mapSurface,
              mapContent,
              currentZoom,
              newZoom,
            });
            console.log(newZoom);
            context.setZoom(newZoom);
          }}
        >
          -
        </button>
        <button
          className="bg-gray-warm-light size-12 rounded-lg"
          onClick={() => {
            const newZoom = currentZoom + zoomFactor;
            if (newZoom > 2) {
              return;
            }
            zoomMap({
              container,
              mapSurface,
              mapContent,
              currentZoom,
              newZoom,
            });
            console.log(newZoom);
            context.setZoom(newZoom);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
const normalRoadSVG = (
  <svg
    width="60"
    height="2"
    viewBox="0 0 60 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="1" x2="60" y2="1" stroke="#4C3B33" stroke-width="2" />
  </svg>
);
const dirtRoadSVG = (
  <svg
    width="60"
    height="2"
    viewBox="0 0 60 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="-8.74228e-08"
      y1="1"
      x2="60"
      y2="0.999995"
      stroke="black"
      stroke-width="2"
      stroke-dasharray="8 3"
    />
  </svg>
);
const offRoadSVG = (
  <svg
    width="60"
    height="2"
    viewBox="0 0 60 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="-8.74228e-08"
      y1="1"
      x2="60"
      y2="0.999995"
      stroke="#FF4800"
      stroke-width="2"
      stroke-dasharray="8 3"
    />
  </svg>
);
const hikingTrailSVG = (
  <svg
    width="60"
    height="3"
    viewBox="0 0 60 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="1.5"
      y1="1.5"
      x2="58.5"
      y2="1.49999"
      stroke="#4C3B33"
      stroke-width="3"
      stroke-linecap="round"
      stroke-dasharray="0.1 7"
    />
  </svg>
);
const riverSVG = (
  <svg
    width="60"
    height="6"
    viewBox="0 0 60 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="3" x2="60" y2="3" stroke="#94E3FF" stroke-width="6" />
  </svg>
);
const mainRoadSVG = (
  <svg
    width="60"
    height="3"
    viewBox="0 0 60 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="1.5" x2="60" y2="1.5" stroke="#FFC400" stroke-width="3" />
  </svg>
);
const pinSVG = (
  <svg
    width="18"
    height="30"
    viewBox="0 0 18 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full"
  >
    <path
      d="M8.68966 30C12.8276 20.1379 17.2414 13.3818 17.2414 8.62069C17.2414 3.85961 13.3818 0 8.62069 0C3.85961 0 0 3.85961 0 8.62069C0 13.3818 4.55172 20.1379 8.68966 30Z"
      fill="#4C3B33"
    />
    <ellipse cx="8.62465" cy="8.48158" rx="3.7931" ry="3.7931" fill="white" />
  </svg>
);
