import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
export default function BurgerMenu({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement>;
}) {
  let dialogOpen = false;
  const { i18n, t } = useTranslation();
  return (
    <div className="group h-auto flex items-center">
      <dialog className="" id="menu-modal" closedby="any" ref={dialogRef}>
        <div
          className="fixed right-0 top-20 flex flex-col bg-bg starting:opacity-0 opacity-100 transition-opacity duration-150"
          onClick={() => dialogRef.current.close()}
        >
          <NavLink
            to={`/${i18n.language}`}
            className="p-2 border-b border-gray-line"
          >
            {t("Main page")}
          </NavLink>
          <NavLink
            to={`/${i18n.language}/booking/change-request-info`}
            className="p-2 border-b border-gray-line"
          >
            {t("Book")}
          </NavLink>
          <NavLink
            to={`/${i18n.language}/map`}
            className="p-2 border-b border-gray-line"
          >
            {t("Points of interest")}
          </NavLink>
          <NavLink
            to={`/${i18n.language}?scroll-to=contacts`}
            className="p-2 border-b border-gray-line"
          >
            {t("Contacts")}
          </NavLink>
        </div>
        {/* <p>123</p> */}
      </dialog>

      <button
        onClick={() => {
          // const dialogOpen = params.dialogRef.current.open;
          if (dialogOpen) {
            dialogRef.current.close();
            dialogOpen = false;
          } else {
            dialogRef.current.showModal();
            dialogOpen = true;
          }
          // console.log("dialogOpen", dialogOpen);
          // params.setModalShow(!dialogOpen);
        }}
        className="space-y-1.25"
      >
        <div
          className={`transition duration-150 group-has-open:opacity-0 opacity-100`}
        >
          {bar}
        </div>
        <div
          className={`transition duration-150 ease-out relative group-has-open:-rotate-45 rotate-0`}
        >
          {bar}
        </div>
        <div
          className={`transition duration-150 ease-out relative group-has-open:rotate-45 rotate-0 group-has-open:bottom-[9px] bottom-0`}
        >
          {bar}
        </div>
      </button>
    </div>
  );
}
const bar = (
  <svg
    width="28"
    height="4"
    viewBox="0 0 28 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="28" height="4" className="fill-primary" />
  </svg>
);
