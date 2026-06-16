import { useEffect, useRef, type ReactNode } from "react";
import { useNavContextProvider } from "./nav/NavContextProvider";
import { useCloseOnClick } from "./formComponents/utils";
import { useState } from "react";

export default function MediaFullView({ children }: { children: ReactNode }) {
  const context = useNavContextProvider();
  const [opacity, setOpacity] = useState(0);
  const contentRef = useRef(null);

  const outsideContentFieldRef = useRef(null);
  useCloseOnClick(contentRef, () => {
    setOpacity(0);
    setTimeout(context.setFullImageView, 300, false);
  });
  useEffect(() => {
    requestAnimationFrame(() => setOpacity(100));
    document.body.style.overflow = "hidden";
    // return () => context.setItemSelected()
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, []);
  return (
    <div
      ref={outsideContentFieldRef}
      onScroll={(e) => {
        e.stopPropagation();
      }}
      className={
        `fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 ` +
        (!opacity ? "opacity-0" : "opacity-100")
      }
    >
      <div className="flex justify-center items-center">
        <div className="relative">
          <div className="absolute -top-8 right-0 cursor-pointer">
            {closeButton}
          </div>
          <div ref={contentRef} className="">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const closeButton = (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="2px"
  >
    <line
      x1="20.1526"
      y1="20.1526"
      x2="6.71752"
      y2="6.71757"
      stroke="#F1F1F1"
    />
    <line
      x1="6.71749"
      y1="20.1525"
      x2="20.1525"
      y2="6.71749"
      stroke="#F1F1F1"
    />
  </svg>
);
