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
          <Link
            to="/"
            className="w-[140px] overflow-visible text-nowrap text-lg font-serif font-medium"
          >
            {t("Site name")}
          </Link>
          <div className="md:flex gap-5 2xl:gap-10 hidden justify-between font-serif font-light">
            <button
              className="hover:underline "
              onClick={() => {
                const el = document.getElementById("about");
                el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("About")}
            </button>
            <button
              className=" hover:underline "
              onClick={() => {
                const el = document.getElementById("contacts");
                el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("Contacts")}
            </button>
            <button
              className="hover:underline"
              onClick={() => {
                const el = document.getElementById("location");
                el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("Location")}
            </button>
            <button
              className="hover:underline "
              onClick={() => {
                const el = document.getElementById("points-of-interest");
                el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("Points of interest")}
            </button>
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
      {/* {loc.pathname.split("/").length !== 2 ? ( */}
      <div className="h-0.5 bg-primary w-full"></div>
      {/* ) : ( */}
      {/*   "" */}
      {/* )} */}
    </div>
  );
}
