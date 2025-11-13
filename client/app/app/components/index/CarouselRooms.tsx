import useEmblaCarousel from "embla-carousel-react";
import type { Image } from "~/types/nav";
import CarouselDots from "./CarouselDots";
import MediaFullView from "../MediaFullView";
import { useState } from "react";
import { useNavContextProvider } from "../nav/NavContextProvider";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export function CarouselRoom({
  slug,
  images,
  imageSize = "small"
}: {
  slug: string;
  images: Array<Image>;
  imageSize: "small" | "blur" | "main"

}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
  });
  const context = useNavContextProvider()
  const imageOnClick = () => {
    if (imageSize !== 'main') {
      context.setFullImageView(true)
    } else {
      return
    }
  }
  return (
    <div className="flex flex-col gap-[21px]">
      <div className={"embla overflow-hidden "} ref={emblaRef}>
        <div className={"embla__container " + (imageSize === 'main' ? "image-full" : "image-small")}>
          {images.map((img, i) => (
            <div
              key={`rooms-slide-${i}`}
              className="embla__slide shrink-0 basis-full"
            >
              <div className="absolute grow h-[388px] bg-olive-dark"></div>
              <img
                className="w-full h-full object-cover"
                src={BASE_URL + img.variants[imageSize]}
                alt={`room-${slug}-${i}`}
                loading="lazy"
                onClick={() => imageOnClick()}
              // onClick={() => context.preStateChangeCallback(() => imageOnClick())}
              />
            </div>
          ))}
        </div>
      </div>
      <CarouselDots emblaRef={emblaRef} emblaApi={emblaApi}></CarouselDots>

    </div>

  );
}
