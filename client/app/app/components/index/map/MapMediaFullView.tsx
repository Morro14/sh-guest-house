import { useEffect, useRef, type ReactNode } from "react";
import { useMapContextProvider } from "./MapContextProvider.tsx";
import { useCloseOnClick } from "~/utils/components.ts";
import { useState } from "react";
import closeButton from "root/src/assets/close-button.svg";

export default function MapMediaFullView({
  children,
}: {
  children: ReactNode;
}) {
  const context = useMapContextProvider();
  const [opacity, setOpacity] = useState(0);
  const contentRef = useRef(null);

  const outsideContentFieldRef = useRef(null);
  useCloseOnClick(contentRef, () => {
    setOpacity(0);
    setTimeout(context.setFullView, 300, false);
  });
  useEffect(() => {
    if (context.fullView) {
      requestAnimationFrame(() => setOpacity(100));
      // return () => context.setItemSelected()
    }
  }, [context.fullView]);
  return (
    <div
      ref={outsideContentFieldRef}
      className={
        `fixed top-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-black-transparent transition duration-300 ` +
        (!opacity ? "opacity-0" : "opacity-100")
      }
    >
      <div
        ref={contentRef}
        className="relative flex justify-center items-center"
      >
        {children}
        <img onClick={() => context.setFullView(false)} src={closeButton} className="absolute top-0 -right-12 z-60 cursor-pointer" />
      </div>

    </div>
  );
}
