import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";
import BurgerMenu from "./BurgerMenu";
import { useState } from "react";

export default function Header() {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div>
      {/* <div className="font-sans text-red-error text-center"> */}
      {/*   {t("This is a test version of the project")} */}
      {/* </div> */}
      <header
        className={`flex flex-col items-center justify-center transition-all w-full text-text-main h-13`}
      >
        <div
          className={`flex justify-between items-center w-full md:px-7 px-2 transition-all overflow-hidden `}
        >
          <Link to="/" className="w-[140px] text-lg font-sans">
            {t("Site name")}
          </Link>
          <div className="md:flex gap-5 2xl:gap-10 hidden justify-between font-sans underline">
            <Link to="contacts" className="hover:underline ">
              {t("About")}
            </Link>
            <Link to="contacts" className="capitalize hover:underline ">
              {t("Rooms")}
            </Link>
            <Link to="contacts" className=" hover:underline ">
              {t("Contacts")}
            </Link>
            <Link to="contacts" className="hover:underline ">
              {t("Location")}
            </Link>
          </div>
          <div className="flex items-center text-sm font-sans gap-7">
            <div className="flex justify-center">
              <LangSelect></LangSelect>
            </div>
            <div className="2xl:hidden block">
              <BurgerMenu
                params={{
                  showModalMenu: showMenu,
                  setShowModalMenu: setShowMenu,
                }}
              ></BurgerMenu>
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
