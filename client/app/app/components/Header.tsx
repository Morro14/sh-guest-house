import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";

export default function Header() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="font-sans text-red-error font-light text-center mb-2">
        {t("This is a test version of the project")}
      </div>
      <header
        className={`flex flex-col items-center transition-all w-full bg-olive-light text-text-main h-9`}
      >
        <div
          className={`flex justify-between items-center w-full px-7 h-12 transition-all overflow-hidden `}
        >
          <Link to="/" className="w-[140px] font-light font-sans">
            {t("Site name")}
          </Link>
          <div className="md:flex hidden justify-between w-[306px] uppercase text-sm font-sans ">
            <Link to="contacts" className="">
              {t("About")}
            </Link>
            <Link to="contacts" className="">
              {t("Rooms")}
            </Link>
            <Link to="contacts" className="">
              {t("Contacts")}
            </Link>
            <Link to="contacts" className="">
              {t("Location")}
            </Link>
          </div>
          <div className="flex items-center text-sm font-sans gap-7">
            <div className="flex justify-center">
              <LangSelect></LangSelect>
            </div>
            {/* <button */}
            {/*   // onClick={} */}
            {/*   className="cursor-pointer text-gray-2 " */}
            {/* > */}
            {/*   Login */}
            {/* {params.auth ? "Logout" : "Login"} */}
            {/* </button> */}
          </div>
        </div>
      </header>
    </div>
  );
}
