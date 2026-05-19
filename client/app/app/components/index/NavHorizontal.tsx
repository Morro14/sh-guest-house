import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useIndexBookingContextProvider } from "~/components/booking/IndexBookingContextProvider";

const RATING = 9.8;

export default function NavHorizontal() {
  const { t, i18n } = useTranslation();
  const context = useIndexBookingContextProvider();
  return (
    <div className="flex 2xl:flex-row flex-col justify-center items-center 2xl:w-full 2xl:gap-5 gap-3 font-serif text-xl">
      <button
        onClick={() => {
          const el = document.getElementById("points-of-interest");
          el.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-center hover:cursor-pointer"
      >
        <span className="px-3 pt-1 ">{t("About")}</span>
      </button>
      <button
        onClick={() => {
          const el = document.getElementById("points-of-interest");
          el.scrollIntoView({ behavior: "smooth" });
        }}
        className="text-center hover:cursor-pointer"
      >
        <span className="px-3 pt-1 ">{t("Contact")}</span>
      </button>
      <Link
        to={`/${i18n.language}/booking`}
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
      <Link to="" className="flex justify-start gap-3">
        <div className="flex items-center gap-1 ">
          <div className="hover:cursor-pointer text-nowrap ">
            {t("Booking reviews")}
          </div>
          <div className="flex items-center gap-1">
            <div>{star}</div>
            <div className="font-serif">{RATING}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}

const star = (
  <svg
    width="26"
    height="25"
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
