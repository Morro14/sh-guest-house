import { useEffect, useRef, type ReactNode } from "react";
import { useMapContextProvider } from "./MapContextProvider.tsx";
import { useCloseOnClick } from "~/utils/components.ts";
import { useState } from "react";
// import closeButton from "root/src/assets/close-button.svg";

export default function MapMediaFullView({
  children,
}: {
  children: ReactNode;
}) {
  const context = useMapContextProvider();
  const [opacity, setOpacity] = useState(0);
  const contentRef = useRef<null | HTMLDivElement>(null);

  const outsideContentFieldRef = useRef<null | HTMLDivElement>(null);
  useCloseOnClick(contentRef, () => {
    setOpacity(0);
    setTimeout(context.setFullView, 300, false);
  });
  useEffect(() => {
    if (context.fullView) {
      requestAnimationFrame(() => setOpacity(100));
      contentRef.current.addEventListener("mousedown", (e) =>
        e.stopImmediatePropagation(),
      );
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [context.fullView]);
  return (
    <div
      id="full-view-non-clickable"
      ref={outsideContentFieldRef}
      className={
        `fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 cursor-default ` +
        (!opacity ? "opacity-0" : "opacity-100")
      }
    >
      <div
        ref={contentRef}
        className="relative flex justify-center items-center"
      >
        {children}
        <div
          onClick={() => context.setFullView(false)}
          className="absolute -top-8 right-0 z-60 cursor-pointer"
        >
          {closeButton}
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
