import { getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import type { Room } from "~/types/booking";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { getTotalPrice } from "../formComponents/utils";
import { useSubmit } from "react-router";

export default function FloatingPanel({ rooms }: { rooms: Room[] }) {
  const params = getUrlSearchParams(["date", "adults", "children", "days"]);
  const guests = Number(params.adults) + Number(params.children);
  const formContext = useBookingRoomSelectContextProvider();
  const moreRoomsRequired =
    formContext.guestPool.adults !== 0 || formContext.guestPool.children !== 0;
  const [panelOffScreen, setPanelOffScreen] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const context = useBookingRoomSelectContextProvider();
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) {
          setPanelOffScreen(true);
        } else {
          setPanelOffScreen(false);
        }
      },
      { root: null, threshold: 0 },
    );
    intersectionObserver.observe(document.getElementById("request-info-block"));
  }, []);

  const submit = useSubmit();
  const date = new Date(params.date);
  const dateF = new Intl.DateTimeFormat([lang, "en"], { dateStyle: "medium" });
  const dateString = dateF.format(date);

  const handleBookClick = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formContext.form) {
      return;
    }
    submit(formContext.form, { method: "post" });
  };

  return (
    <div
      className={`${panelOffScreen ? "fixed top-4" : "absolute top-4"} z-20 top-0 w-full flex flex-col items-center justify-start`}
    >
      <div
        className={`absolute 2xl:w-[1100px] ${moreRoomsRequired ? "h-16" : "h-10"} transition-all duration-200 drop-shadow-sm rounded-sm bg-bg`}
      ></div>
      <div className="flex flex-col justify-start">
        <div
          className={`z-10 flex justify-between items-center w-[1100px] mt-2 h-6`}
        >
          <div className="w-[112px] px-4"></div>
          <div className={`flex items-center gap-7 font-sans overflow-hidden`}>
            <div>{`Date: ${dateString}`}</div>
            <div>{`Guests: ${guests}`}</div>
            <div>{`Nights: ${params.days}`}</div>
            <div>{`Price: ${context.totalPrice}`}</div>
          </div>
          <button
            onClick={handleBookClick}
            className="w-[112px] cursor-pointer hover:underline"
          >
            {/* <div className={`flex items-center gap-2 px-4 h-full transition-colors duration-200 font-medium text-lg ${moreRoomsRequired ? 'stroke-gray-warm-inactive text-gray-warm-inactive' : 'stroke-peach stroke-2 text-text-main'} `}> */}
            <div
              className={`${!moreRoomsRequired ? "border-b-2 border-peach " : "text-gray-warm-inactive"} mr-1 font-medium text-lg `}
            >
              <div>{t("Book")}</div>
            </div>
            {/* {bookingArrowSmall} */}
            {/* </div> */}
          </button>
        </div>
        <div
          className={`z-10 text-red-error text-center font-sans ${moreRoomsRequired ? "block" : "hidden opacity-0"} transition-discrete transition-all duration-200`}
        >{`Select more rooms to accommodate ${guests} guests`}</div>
      </div>
    </div>
  );
}

const bookingArrowSmall = (
  <svg
    width="33"
    height="9"
    viewBox="0 0 33 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className=""
  >
    <path d="M-1.66893e-06 4.5C19.8 4.5 29.5833 4.5 32 4.5" />
    <path
      d="M25 8.5C27.5104 5.54346 29.908 4.5 32 4.5"
      stroke-linecap="round"
    />
    <path
      d="M25 0.5C27.5104 3.45654 29.908 4.5 32 4.5"
      stroke-linecap="round"
    />
  </svg>
);

const bookingArrowBig = (
  <svg
    width="104"
    height="16"
    viewBox="0 0 104 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M-2.86102e-06 8.00001C63.1125 8 94.2969 8 102 8"
      stroke-width="2"
    />
    <path
      d="M90 15C94.4829 9.82605 98.7643 8 102.5 8"
      stroke-width="2"
      stroke-linecap="round"
    />
    <path
      d="M90 1C94.4829 6.17395 98.7643 8 102.5 8"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);
