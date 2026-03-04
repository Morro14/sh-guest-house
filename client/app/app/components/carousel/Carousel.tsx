import useEmblaCarousel from "embla-carousel-react";
import type { Image } from "~/types/booking";
import CarouselDots from "./CarouselDots";
import { useNavContextProvider } from "../nav/NavContextProvider";
import CarouselDotsFullView from "./CarouselDotsFullView";
import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export function Carousel({
  name,
  images,
  imageSize = "small",
  imageRes,
  fullView = false,
  border = false,
}: {
  name: string;
  images: Array<Image>;
  imageSize: "small" | "main" | "full";
  imageRes: "small" | "blur" | "main" | "original";
  fullView?: boolean;
  border?: boolean;
}) {
  const context = useNavContextProvider();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: fullView ? context.imageSelected : 0,
  });
  const imageOnClick = (imageIndex: number) => {
    if (!fullView) {
      context.setFullImageView(true);
      context.setImageSelected(imageIndex);
    } else {
      return;
    }
  };
  useEffect(() => {
    if (emblaApi && fullView) {
      if (emblaApi.selectedSnap() === context.imageSelected) return;
      emblaApi.goTo(context.imageSelected);
    }
  }, [emblaApi, fullView, context.imageSelected]);
  return fullView ? (
    <div className="flex flex-col gap-5 items-center justify-end shrink size-full">
      <div className="embla bg-black-transparent border-2 border-peach size-full">
        <div className="embla__viewport size-full" ref={emblaRef}>
          <div className={`embla__container  size-full`}>
            {images.map((img, i) => (
              <div
                key={`${name}-slide-${i}`}
                className="embla__slide shrink-0 grow basis-full h-full flex justify-center items-center"
              >
                <img
                  className={`h-full object-contain`}
                  src={BASE_URL + img.variants[imageRes]}
                  alt={`${name}-${i}`}
                  // loading="lazy"
                  onClick={() => imageOnClick(i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky">
        {/* <CarouselDots emblaRef={emblaRef} emblaApi={emblaApi}></CarouselDots> */}
        <CarouselDotsFullView
          emblaRef={emblaRef}
          emblaApi={emblaApi}
          snapListLen={images.length}
        ></CarouselDotsFullView>
      </div>
    </div>
  ) : (
    <div className={`flex flex-col gap-5 2xl:w-full md:w-[688px]`}>
      <div
        className={`"embla overflow-hidden carousel-small ${border ? "border-2 border-peach" : ""}`}
        ref={emblaRef}
      >
        <div className={`embla__container`}>
          {images.map((img, i) => (
            <div
              key={`${name}-slide-${i}`}
              className="embla__slide shrink-0 basis-full "
            >
              <div className={`flex justify-center carousel-small `}>
                <img
                  className={` object-cover w-full hover:cursor-pointer`}
                  src={BASE_URL + img.variants[imageRes]}
                  alt={`${name}-${i}`}
                  loading="lazy"
                  onClick={() => imageOnClick(i)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <CarouselDots emblaRef={emblaRef} emblaApi={emblaApi}></CarouselDots>
    </div>
  );
}
