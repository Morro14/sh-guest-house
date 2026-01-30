import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header
      className={`flex flex-col items-center transition-all w-screen bg-olive-light text-text-main h-9`}
    >
      <div
        className={`flex justify-between items-center w-screen px-7 h-12 transition-all overflow-hidden `}
      >
        <Link to="/" className="w-[140px] font-light font-sans">
          Shushan GH
        </Link>
        <div className="flex justify-between w-[306px] underline text-sm font-sans">
          <Link to="contacts" className="w-[82px]">
            {t("CONTACTS")}
          </Link>
          <Link to="contacts" className="w-[82px]">
            LOCATION
          </Link>
          <Link to="contacts" className="w-[82px]">
            ROOMS
          </Link>
        </div>
        <div className="flex items-center text-sm font-sans gap-7">
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
