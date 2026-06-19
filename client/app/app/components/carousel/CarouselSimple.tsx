import type { Image } from "~/types/booking";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { ImageLoading } from "../ImageLoading";
import Dots from "../status/Dots";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;
export function CarouselSimple({
  name,
  images,
  imageRes,
  border = false,
}: {
  name: string;
  images: Array<Image>;
  imageRes: "small" | "blur" | "main" | "original";
  border?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    duration: 50,
  });
  const [autoScroll, setAutoScroll] = useState(true);
  useEffect(() => {
    if (!emblaApi || !autoScroll) {
      return;
    }

    const interval = setInterval(() => {
      emblaApi.goToNext();
    }, 6000);
    emblaApi.on("pointerup", () => {
      clearInterval(interval);
      setAutoScroll(false);
    });
  }, [autoScroll, emblaApi]);
  return (
    <div
      className={`"embla__viewport overflow-hidden size-full ${border ? "border-2 border-peach" : ""}`}
      ref={emblaRef}
    >
      <div className={`embla__container size-full`}>
        {images.map((img, i) => (
          <div
            key={`${name}-slide-${i}`}
            className="embla__slide shrink-0 basis-auto mx-2 select-none h-auto"
          >
            <div className={`flex justify-center h-full`}>
              <ImageLoading
                imageAttrs={{
                  className: `object-contain w-full`,
                  src: MEDIA_URL + img.variants[imageRes],
                  alt: `${name}-${i}`,
                }}
                placeholder={imgLoadingPlaceholder}
              ></ImageLoading>
              {/* <img */}
              {/*   className={` object-contain w-full`} */}
              {/*   src={MEDIA_URL + img.variants[imageRes]} */}
              {/*   alt={`${name}-${i}`} */}
              {/*   loading="lazy" */}
              {/* /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const imgLoadingPlaceholder = (
  <div className="w-64 flex items-center justify-center bg-gray-warm-light h-full">
    <Dots></Dots>
  </div>
);
