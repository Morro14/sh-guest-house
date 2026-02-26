import { formatPrice, getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";

const CURRENCY = import.meta.env.VITE_CURRENCY;

export default function FloatingPanel() {
  const params = getUrlSearchParams(["date", "adults", "children", "nights"]);
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
  const price = context.priceFetcher.data?.reservation_price || 0;
  const priceStatus = context.priceFetcher.state;
  return (
    <div
      className={`${panelOffScreen ? "fixed top-4" : "absolute top-4"} z-20 top-0 w-full flex flex-col items-center justify-start `}
    >
      <div
        className={`absolute booking-floating-panel ${moreRoomsRequired ? "h-16" : "h-10"} transition-all duration-200 bg-apricot-superlight rounded-sm outline-2 outline-apricot -outline-offset-1`}
      ></div>
      <div className="flex flex-col justify-start ">
        <div
          className={`z-10 flex justify-between items-center w-[1100px] mt-2 h-6`}
        >
          <div className="w-[112px] px-4"></div>
          <div className={`flex items-center gap-7 font-sans`}>
            <div>{`Date: ${dateString}`}</div>
            <div>{`Guests: ${guests}`}</div>
            <div>{`Nights: ${params.nights}`}</div>
            <div className="w-16 overflow-visible text-nowrap">
              {`Price: ${priceStatus === "idle" ? formatPrice(price, CURRENCY) : "..."}`}
            </div>
          </div>
          <button
            onClick={handleBookClick}
            className="w-[112px] cursor-pointer hover:underline"
          >
            <div
              className={`${!moreRoomsRequired ? "border-b-2 border-peach " : "text-gray-warm-inactive"} mr-1 font-medium text-lg `}
            >
              <div>{t("Book")}</div>
            </div>
          </button>
        </div>
        <div
          className={`z-10 text-red-error text-center font-sans ${moreRoomsRequired ? "block" : "hidden opacity-0"} transition-discrete transition-all duration-200`}
        >{`Select more rooms to accommodate ${guests} guests`}</div>
      </div>
    </div>
  );
}
