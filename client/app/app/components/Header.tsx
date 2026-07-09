import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";
import BurgerMenu from "./BurgerMenu";
import { useRef } from "react";
import HeaderIndexNav from "./HeaderIndexNav";

export default function Header() {
  const { t } = useTranslation();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  return (
    <div>
      <div className="font-sans text-white font-medium text-center bg-primary">
        {t("This is a test version of the project")}
      </div>
      <header className={`flex items-center w-full text-text-main h-13`}>
        <div
          className={`flex justify-between items-center w-full md:px-7 px-2 transition-all overflow-hidden `}
        >
          <Link to="/" className="lg:w-1/3 w-1/2 text-lg font-sc font-medium">
            {t("Site name")}
          </Link>

          <HeaderIndexNav></HeaderIndexNav>
          <div className="flex items-center text-sm font-sans gap-7 lg:w-1/3 w-1/2 justify-end">
            <div className="flex justify-center">
              <LangSelect></LangSelect>
            </div>
            <div className="lg:hidden block ">
              <BurgerMenu dialogRef={dialogRef}></BurgerMenu>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
