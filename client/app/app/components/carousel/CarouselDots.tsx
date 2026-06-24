import { useEffect, useRef, useState } from "react";
import NavArrow from "../nav/NavArrow";
import type { EmblaCarouselType } from "embla-carousel";

export default function CarouselDots({
  emblaApi,
  snapListLen,
}: {
  emblaApi: EmblaCarouselType;
  snapListLen: number;
}) {
  const [currentSnap, setCurrentSnap] = useState(0);
  const [snapListLength, setSnapListLength] = useState(snapListLen);
  const selectorRef = useRef(undefined);
  if (selectorRef.current) {
    selectorRef.current.style.left = String(currentSnap * 35 + "px");
  }
  const dotsNum = snapListLength;
  const dots = Array.from({ length: dotsNum }, (_, i) => {
    return (
      <div
        key={`room-dot-${i}`}
        onClick={() => {
          setCurrentSnap(i);
          emblaApi.goTo(i);
        }}
        className="w-3.5 h-3.5 rounded-[7px] cursor-pointer hover:bg-primary-light bg-gray-warm-mid"
      ></div>
    );
  });
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", (emblaApi, event) => {
      const { targetSnap } = event.detail;
      setSnapListLength(emblaApi.snapList().length);
      setCurrentSnap(targetSnap);
    });
  }, [emblaApi]);

  return (
    <div
      className={
        "flex grow gap-[41px] justify-center items-center transtion-all duration-300"
      }
    >
      <NavArrow
        key={"rooms-arrow-left"}
        direction="left"
        numElements={dotsNum}
        index={currentSnap}
        func={() =>
          currentSnap > 0 ? emblaApi?.goTo(currentSnap - 1) : undefined
        }
      />
      <div className="flex relative gap-[21px]">
        <div
          ref={selectorRef}
          className="absolute w-3.5 h-3.5 rounded-[7px] bg-primary transition-all duration-500 ease-out pointer-event-none"
        ></div>
        {dots}
      </div>
      <NavArrow
        key={"rooms-arrow-right"}
        direction="right"
        index={currentSnap}
        func={() =>
          currentSnap < snapListLength - 1
            ? emblaApi?.goTo(currentSnap + 1)
            : undefined
        }
        numElements={dotsNum}
      />
    </div>
  );
}
