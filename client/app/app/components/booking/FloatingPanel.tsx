import { formatPrice, getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useSubmit } from "react-router";

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
      className={`${panelOffScreen ? "fixed top-4" : "absolute top-4"} z-20 top-0 flex flex-col items-center justify-start font-sans`}
    >
      <div
        className={`absolute booking-floating-panel ${moreRoomsRequired ? "h-[64px]" : "h-[42px]"} transition-all duration-200 bg-bg outline-2 -outline-offset-4 outline-primary rounded shadow-md`}
      ></div>
      <div
        className={`flex flex-col justify-start items-start w-full mt-2.5 booking-floating-panel px-4`}
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
            <div className={`flex overflow-visible w-30 space-x-1`}>
              <span className="text-nowrap">{`${t("Total price")}:`}</span>
              <span
                className={`${priceStatus !== "idle" ? "opacity-0" : "opacity-100"} transition-opacity duration-150 text-nowrap`}
              >{`${formatPrice(price, CURRENCY)}`}</span>
            </div>
          </div>
          <button
            disabled={moreRoomsRequired}
            onClick={handleBookClick}
            className="px-2 w-16 flex cursor-pointer "
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
