import type { EmblaViewportRefType } from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";
import { useNavContextProvider } from "../nav/NavContextProvider";
import NavArrow from "app/components/nav/NavArrow";

export default function CarouselDotsFullView({
  emblaRef,
  emblaApi,
  snapListLen,
}: {
  emblaRef: EmblaViewportRefType;
  emblaApi: any;
  snapListLen: number;
}) {
  const context = useNavContextProvider();
  const [dotSelected, setDotSelected] = useState(context.imageSelected);
  console.log("imageSelected", context.imageSelected);
  const selectorRef = useRef(undefined);
  if (selectorRef.current) {
    selectorRef.current.style.left = String(dotSelected * 35 + "px");
  }
  const [dots, setDots] = useState([]);
  useEffect(() => {
    if (!emblaApi) {
      return;
    }
    if (emblaApi) {
      setDotSelected(emblaApi.selectedScrollSnap());
      const snapsLength = snapListLen;
      const genMoreDots = (newDotsNum: number, currentDotsNum: number) =>
        Array.from({ length: newDotsNum }, (_, i) => {
          return (
            <div
              key={`room-dot-${currentDotsNum + i}`}
              onClick={() => emblaApi?.scrollTo(currentDotsNum + i)}
              className="w-3.5 h-3.5 rounded-[7px] cursor-pointer hover:bg-peach-light bg-gray-warm"
            ></div>
          );
        });
      const genDots = genMoreDots(snapsLength, 0);
      setDots(genDots);
    }
    emblaApi.on("select", () => {
      setDotSelected(emblaApi.selectedScrollSnap());
    });
  }, [snapListLen, emblaApi]);

  return (
    <div
      className={
        "flex grow gap-[41px] justify-center items-center transtion-all duration-300"
      }
    >
      <NavArrow
        key={"rooms-arrow-left"}
        direction="left"
        numElements={dots.length}
        index={dotSelected}
        func={() =>
          dotSelected > 0 ? emblaApi?.scrollTo(dotSelected - 1) : undefined
        }
      />
      <div className="flex relative gap-[21px]">
        <div
          ref={selectorRef}
          className="absolute w-3.5 h-3.5 rounded-[7px] bg-peach transition-all duration-500 ease-out pointer-event-none"
        ></div>
        {dots ? dots : ""}
      </div>
      <NavArrow
        key={"rooms-arrow-right"}
        direction="right"
        index={dotSelected}
        func={() =>
          dotSelected < dots.length - 1
            ? emblaApi?.scrollTo(dotSelected + 1)
            : undefined
        }
        numElements={dots.length}
      />
    </div>
  );
}
