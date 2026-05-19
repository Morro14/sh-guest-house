import type { SetStateAction } from "react";
export default function BurgerMenu({
  params,
}: {
  params: {
    showModalMenu: boolean;
    setShowModalMenu: React.Dispatch<SetStateAction<boolean>>;
  };
}) {
  return (
    <button
      onClick={() => params.setShowModalMenu(!params.showModalMenu)}
      className="size-7 space-y-1.25"
    >
      <div
        className={`transition duration-150 ${params.showModalMenu ? "opacity-0" : "opacity-100"}`}
      >
        {bar}
      </div>
      <div
        className={`transition duration-150 ease-out relative ${params.showModalMenu ? "rotate-45 " : ""}`}
      >
        {bar}
      </div>
      <div
        className={`transition duration-150 ease-out relative ${params.showModalMenu ? "-rotate-45 bottom-[9px]" : ""}`}
      >
        {bar}
      </div>
    </button>
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
    <rect width="28" height="4" className="fill-text-main" />
  </svg>
);
