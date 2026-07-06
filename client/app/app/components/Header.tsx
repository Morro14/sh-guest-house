import { Link, matchPath, NavLink, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";
import BurgerMenu from "./BurgerMenu";
import { useState } from "react";
import HeaderIndexNav from "./HeaderIndexNav";

export default function Header() {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const loc = useLocation();
  const lang = loc.pathname.split("/")[1];
  console.log("lang", lang);
  const match = matchPath({ path: "/:lang" }, loc.pathname);
  return (
    <div>
      {/* <div className="font-sans text-red-error text-center"> */}
      {/*   {t("This is a test version of the project")} */}
      {/* </div> */}
      <header
        className={`flex flex-col items-center justify-center w-full text-text-main h-13`}
      >
        <div
          className={`flex justify-between items-center w-full md:px-7 px-2 transition-all overflow-hidden `}
        >
          <Link
            to="/"
            className="w-[140px] overflow-visible text-nowrap text-lg font-serif font-medium"
          >
            {t("Site name")}
          </Link>

          {match ? (
            <HeaderIndexNav></HeaderIndexNav>
          ) : (
            <NavLink to={`/${lang}`}>{t("To main page")}</NavLink>
          )}
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
      {/* {loc.pathname.split("/").length !== 2 ? ( */}
      <div className="h-0.5 bg-primary w-full"></div>
      {/* ) : ( */}
      {/*   "" */}
      {/* )} */}
    </div>
  );
}
