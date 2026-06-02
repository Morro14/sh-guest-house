import { useEffect, useRef, type ReactNode } from "react";
import { useNavContextProvider } from "./nav/NavContextProvider";
import { useCloseOnClick } from "./formComponents/utils";
import { useState } from "react";
import closeButton from "root/src/assets/close-button.svg";

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
      <div
        ref={contentRef}
        className="flex justify-center media-full-view items-center"
      >
        {children}
      </div>
      <img src={closeButton} className="fixed top-5 right-5 cursor-pointer" />
    </div>
  );
}
