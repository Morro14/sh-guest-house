import { formatPrice, getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";
import Dots from "../status/Dots";

const CURRENCY = import.meta.env.VITE_CURRENCY;

export default function FloatingPanel() {
  const params = getUrlSearchParams(["date", "adults", "children", "nights"]);
  const [adults, children] = [Number(params.adults), Number(params.children)];
  const guests = adults + children;
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
  console.log(priceStatus);
  return (
    <div
      className={`${panelOffScreen ? "fixed top-0" : "absolute top-0"} z-20 top-0 flex flex-col items-center justify-start font-sans`}
    >
      <div
        className={`absolute w-screen ${moreRoomsRequired ? "h-[64px]" : "h-[42px]"} transition-all duration-200 bg-bg border-t border-gray-warm-light shadow-md`}
      ></div>
      <div
        className={`flex flex-col 2xl:items-center justify-start items-start mt-2.5 booking-floating-panel 2xl:w-[1038px]! px-4`}
      >
        <div className={`z-10 flex justify-between items-center size-full`}>
          <div className="w-16 overflow-visible text-nowrap text-gray-warm-mid 2xl:block hidden">
            {t("Your reservation")}:
          </div>
          <div className={`flex gap-6 items-center`}>
            <div
              className={`${panelOffScreen ? "block" : "max-2xl:hidden"} 2xl:block hidden `}
            >{`${dateString}`}</div>
            <div
              className={`${panelOffScreen ? "block" : "max-2xl:hidden"} 2xl:block hidden`}
            >
              {`${t("guests")}: ${params.adults}` +
                (children > 0 ? " + " + children : "")}
            </div>
            <div
              className={`${panelOffScreen ? "block" : "max-2xl:hidden"} 2xl:block hidden `}
            >{`${t("nights")}: ${params.nights}`}</div>
            <div className={`flex overflow-visible w-30 space-x-1 relative`}>
              <span className="text-nowrap">{`${t("Total price")}:`}</span>
              <div
                className={`${priceStatus !== "idle" ? "block" : "hidden"} starting:opacity-0 opacity-100 transition-opacity duration-150 absolute right-0 top-2`}
              >
                <Dots></Dots>
              </div>
              <span
                className={`${priceStatus !== "idle" ? "opacity-0" : "opacity-100"} transition-opacity duration-150 text-nowrap`}
              >{`${formatPrice(price, CURRENCY)}`}</span>
            </div>
          </div>
          <button
            disabled={moreRoomsRequired}
            onClick={handleBookClick}
            className="px-2 flex cursor-pointer "
          >
            <div
              className={`${moreRoomsRequired ? "border-0 text-gray-warm-inactive" : "underline font-sans font-medium text-text-main"}`}
            >
              {t("Continue")}
            </div>
          </button>
        </div>
        <div
          className={`z-10 text-red-error text-center ${moreRoomsRequired ? "block" : "hidden opacity-0"} transition-discrete transition-all duration-200`}
        >{`Select more rooms to accommodate ${guests} guests`}</div>
      </div>
    </div>
  );
}
