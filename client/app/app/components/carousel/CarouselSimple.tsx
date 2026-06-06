import type { Image } from "~/types/booking";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

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
  });
  const [autoScroll, setAutoScroll] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!emblaApi || autoScroll) {
      return;
    }

    const interval = setInterval(() => {
      emblaApi.goToNext();
    }, 6000);
    setAutoScroll(interval);
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
              <img
                className={` object-contain w-full`}
                src={MEDIA_URL + img.variants[imageRes]}
                alt={`${name}-${i}`}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
