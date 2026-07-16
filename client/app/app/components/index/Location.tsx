import googleMapsIcon from "root/src/assets/google-map-icon.svg";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";

const YEGHEG_STATION_MAP = "https://maps.app.goo.gl/K1eDG9ESCL5tXhdA9";
const VERNASHEN_STATION_MAP = "https://maps.app.goo.gl/eDJZLFoaR4Nn7V8u8";

export default function LocationMain() {
  const { t } = useTranslation();
  const spoilerRef = useRef<HTMLDialogElement | null>(null);
  const [showSpolier, setShowSpoiler] = useState(false);
  return (
    <div>
      <div className="flex md:flex-row flex-col items-center md:justify-center col-span-2 font-sans md:gap-5 gap-2 text">
        <a
          href="https://maps.app.goo.gl/48eyX1Yuqn6haWYZ8"
          className="flex gap-2 underline hover:cursor-pointer"
        >
          <img className="w-3" src={googleMapsIcon} />
          <div>{t("Open in Google Maps")}</div>
        </a>
        <span
          className="underline text-gray-warm-inactive pointer-events-none hover:cursor-pointer"
          aria-disabled
        >
          {t("Open a written guide")}
        </span>
        <button
          className="underline hover:cursor-pointer"
          onClick={() => {
            spoilerRef.current.showModal();
          }}
        >
          {t("Shuttle from Yeghegnadzor")}
        </button>
      </div>
      <dialog
        id="shuttle-schedule-dialog"
        ref={spoilerRef}
        closedby="any"
        className="m-auto bg-transparent"
      >
        <div className="p-5 bg-bg">
          <button
            className="text-sm underline absolute top-0 right-0"
            onClick={() => {
              spoilerRef.current.close();
            }}
          >
            {closeButton}
          </button>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-items-center gap-3 bg-bg">
            <div className="flex flex-col items-center">
              <h5 className="text-center">
                {t("From Yeghegnadzor to Vernashen")}
              </h5>
              <a
                href={YEGHEG_STATION_MAP}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-gray-warm-mid"
              >
                {t("station location")}
              </a>
              <ul className="font-sans font-[350] flex flex-col items-center mt-1">
                <li>8:25</li>
                <li>10:00</li>
                <li>11:00</li>
                <li>12:00</li>
                <li>13:30</li>
                <li>14:30</li>
                <li>15:30</li>
                <li>16:30</li>
                <li>17:30</li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h5>{t("From Vernashen to Yeghegnadzor")}</h5>
              <a
                href={VERNASHEN_STATION_MAP}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-gray-warm-mid"
              >
                {t("station location")}
              </a>
              <ul className="font-sans font-[350] flex flex-col items-center mt-1">
                <li>8:35</li>
                <li>10:10</li>
                <li>11:10</li>
                <li>12:10</li>
                <li>13:40</li>
                <li>14:40</li>
                <li>15:40</li>
                <li>16:40</li>
                <li>17:40</li>
              </ul>
            </div>
          </div>
          {/* <button */}
          {/*   className="text-sm underline m-auto" */}
          {/*   onClick={() => { */}
          {/*     spoilerRef.current.close(); */}
          {/*   }} */}
          {/* > */}
          {/*   {t("close")} */}
          {/* </button> */}
        </div>
      </dialog>
    </div>
  );
}

const closeButton = (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="2px"
    className="stroke-text-main"
  >
    <line x1="20.1526" y1="20.1526" x2="6.71752" y2="6.71757" />
    <line x1="6.71749" y1="20.1525" x2="20.1525" y2="6.71749" />
  </svg>
);
