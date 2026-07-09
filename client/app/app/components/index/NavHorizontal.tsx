import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const RATING = 9.8;
const BOOKING_URL = "https://www.booking.com/hotel/am/shushan-guest-house.html";

export default function NavHorizontal() {
  const { t, i18n } = useTranslation();
  return (
    <div className="flex 2xl:flex-row flex-col justify-center items-center 2xl:w-full 2xl:gap-5 gap-1 font-serif text-lg underline">
      <button
        onClick={() => {
          const el = document.getElementById("about");
          el.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-center hover:cursor-pointer"
      >
        <span className="px-3 pt-1 ">{t("About")}</span>
      </button>
      <button
        onClick={() => {
          const el = document.getElementById("contacts");
          el.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-center hover:cursor-pointer"
      >
        <span className="px-3 pt-1 ">{t("Contact")}</span>
      </button>
      <Link
        to={`/${i18n.language}/booking/change-request-info`}
        className="text-end hover:cursor-pointer "
      >
        <span className=" px-3 pt-1 rounded">{t("Book")}</span>
      </Link>
      {/* <div className="max-2xl:hidden h-5 w-0.5 bg-gray-warm-light"></div> */}
      <button
        onClick={() => {
          const el = document.getElementById("points-of-interest");
          el.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-center hover:cursor-pointer"
      >
        <span className="px-3 pt-1 ">{t("Points of interest")}</span>
      </button>
      {/* <div className="max-2xl:hidden h-5 w-0.5 bg-gray-warm-light"></div> */}
      <Link to={BOOKING_URL} className="flex justify-start gap-3">
        <div className="flex items-center gap-1 ">
          <div className="hover:cursor-pointer text-nowrap ">
            {t("Booking.com reviews")}
          </div>
          <div className="flex items-center gap-1">
            <div className="">{star}</div>
            <div className="font-serif">{RATING}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

const star = (
  <svg
    width="22"
    height="21"
    viewBox="0 0 26 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.8394 0L15.8703 9.32827H25.6786L17.7435 15.0935L20.7745 24.4217L12.8394 18.6565L4.90425 24.4217L7.93519 15.0935L9.25064e-05 9.32827H9.80842L12.8394 0Z"
      fill="#FB966E"
    />
  </svg>
);
