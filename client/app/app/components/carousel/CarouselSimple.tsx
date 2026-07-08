import type { Image } from "~/types/booking";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { ImageLoading } from "../ImageLoading";
import PlaceholderLoading from "../placeholders/PlaceholderLoading";

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
            className="embla__slide grow-0 shrink-0 h-full basis-auto mx-2 select-none bg-gray-warm-light"
          >
            <ImageLoading
              imageAttrs={{
                className: `object-contain min-h-[30vh] h-[30vh]`,
                src: MEDIA_URL + img.variants[imageRes],
                alt: `${name}-${i}`,
              }}
              placeholderLoading=<PlaceholderLoading
                minWidth={160}
              ></PlaceholderLoading>
            ></ImageLoading>
          </div>
        ))}
      </div>
    </div>
  );
}
