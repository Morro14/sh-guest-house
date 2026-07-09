import { formatPrice, getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import { useEffect, useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
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

  // const submit = useSubmit();
  const date = new Date(params.date);
  const dateF = new Intl.DateTimeFormat([lang, "en"], { dateStyle: "medium" });
  const dateString = dateF.format(date);
  const fetcher = useFetcher();

  const handleBookClick = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!formContext.form) {
      return;
    }
    fetcher.submit(formContext.form, { method: "post" });
  };
  const price = context.priceFetcher.data?.reservation_price || 0;
  const priceStatus = context.priceFetcher.state;
  const submittingRoomsState = fetcher?.state;
  return (
    <div
      className={`${panelOffScreen ? "fixed top-0" : "absolute top-0"} z-20 top-0 flex flex-col items-center justify-start font-sans`}
    >
      <div
        className={`absolute w-screen max-md:h-16 h-[39px] transition-all duration-200 bg-bg border-t border-gray-warm-light shadow-md`}
      ></div>
      <div
        className={`flex flex-col 2xl:items-center justify-start items-start mt-2 index-container-1 2xl:w-[1038px]! px-4`}
      >
        <div
          className={`z-10 flex md:flex-row flex-col justify-between items-center size-full`}
        >
          <div className={`flex relative gap-2 items-center h-6`}>
            <div className="text-sm text-gray-warm-mid">{`${t("Total price")}:`}</div>
            <div className={`${priceStatus !== "idle" ? "block" : "hidden"} `}>
              <Dots></Dots>
            </div>
            <span
              className={`${priceStatus !== "idle" ? "hidden" : "block"}`}
            >{`${formatPrice(price, CURRENCY)}`}</span>
          </div>
          <button
            disabled={moreRoomsRequired}
            onClick={handleBookClick}
            className="px-2 flex cursor-pointer "
          >
            <div
              className={`${moreRoomsRequired ? "hidden" : "block"} font-sans font-medium text-white bg-primary rounded px-1 w-34`}
            >
              {submittingRoomsState === "idle"
                ? t("Continue")
                : t("loading...")}
            </div>
          </button>
          <div
            className={`z-10 text-white bg-primary relative -left-1 px-1 rounded font-medium text-center text-sm ${moreRoomsRequired ? "block" : "hidden"}`}
          >{`Select more rooms to accommodate ${guests} guests`}</div>
        </div>
      </div>
    </div>
  );
}
