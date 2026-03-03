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
  return (
    <div
      className={`${panelOffScreen ? "fixed top-4" : "absolute top-4"} z-20 top-0 w-full flex flex-col items-center justify-start `}
    >
      <div
        className={`absolute booking-floating-panel border-t border-gray-warm-inactive ${moreRoomsRequired ? "h-14" : "h-[38px]"} transition-all duration-200 bg-bg rounded-sm shadow-md`}
      ></div>
      <div className="flex flex-col justify-start items-center w-full">
        <div
          className={`z-10 flex flex-col  justify-center items-center mt-2 lg:h-6 h-full booking-floating-panel`}
        >
          <div
            className={`lg:grid lg:grid-cols-6 flex capitalize lg:w-full lg:place-items-center lg:place-content-center justify-center items-center lg:gap-7 gap-3 font-sans`}
          >
            <div
              className={`${panelOffScreen ? "block" : "max-lg:hidden"} lg:col-start-2 lg:block hidden `}
            >{`${dateString}`}</div>
            <div
              className={`${panelOffScreen ? "block" : "max-lg:hidden"} lg:col-start-3  lg:block hidden`}
            >
              {`${t("guests")}: ${params.adults}` +
                (children > 0 ? " + " + children : "")}
            </div>
            <div
              className={`${panelOffScreen ? "block" : "max-lg:hidden"} lg:col-start-4 lg:block hidden `}
            >{`${t("nights")}: ${params.nights}`}</div>
            <div className="overflow-visible text-nowrap lg:col-start-5 ">
              {`Price: ${priceStatus === "idle" ? formatPrice(price, CURRENCY) : "..."}`}
            </div>
            <button
              disabled={moreRoomsRequired}
              onClick={handleBookClick}
              className="px-2 lg:col-start-6 bg-peach disabled:bg-gray-warm-inactive rounded-sm"
            >
              <div
                className={`${moreRoomsRequired ? "text-gray-warm-inactive" : "text-text-main"} font-sans font-medium text-white `}
              >
                <div className="">{t("Book")}</div>
              </div>
            </button>
          </div>
        </div>
        <div
          className={`z-10 text-red-error text-center font-sans ${moreRoomsRequired ? "block" : "hidden opacity-0"} transition-discrete transition-all duration-200`}
        >{`Select more rooms to accommodate ${guests} guests`}</div>
      </div>
    </div>
  );
}
