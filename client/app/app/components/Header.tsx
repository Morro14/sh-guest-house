import { Link } from "react-router";
import BookingPanel from "./BookingPanel";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";
import { useEffect, useState } from "react";

const LOGOUT_URL = "auth/logout";

export default function Header({ bookingPannelEnabled }: { bookingPannelEnabled: boolean }) {
  const { t, i18n } = useTranslation();
  const [scrollTopMax, setScrollTopMax] = useState(0)
  useEffect(() => {
    document.addEventListener("scroll", (e) => setScrollTopMax(e.target.scrollingElement.scrollTop))
  })
  return (
    <header className={`flex flex-col items-center transition-all w-screen bg-olive-light h-[46px]`} >
      <div className={`flex justify-between items-center w-screen px-7 h-12 transition-all overflow-hidden `}>
        <div className="w-[140px]"></div>
        <div className="flex justify-between w-[306px] text-lg  underline font-sans">
          <Link
            to="contacts"
            className="w-[82px]"
          >
            {t("CONTACTS")}
          </Link>
          <Link
            to="contacts"
            className="w-[82px]"
          >
            LOCATION
          </Link>
          <Link
            to="contacts"
            className="w-[82px]"
          >
            ROOMS
          </Link>
        </div>
        <div className="flex items-center text-base font-sans gap-7">
          <div className="flex justify-center">
            <LangSelect></LangSelect>
          </div>
          <button
            // onClick={}
            className="cursor-pointer text-gray-2"
          >
            Login
            {/* {params.auth ? "Logout" : "Login"} */}
          </button>
        </div>
      </div>

    </header>
  );
}
