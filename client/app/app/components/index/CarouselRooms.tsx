import useEmblaCarousel from "embla-carousel-react";
import type { Image } from "./Rooms";
import CarouselDots from "./CarouselDots";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export function CarouselRoom({
  slug,
  images,
}: {
  slug: string;
  images: Array<Image>;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
  });
  return (
    <div className="flex flex-col gap-[21px]">
      <div className="embla overflow-hidden 2xl:h-[388px]" ref={emblaRef}>
        <div className="embla__container w-[688px] h-[388px]">
          {images.map((img, i) => (
            <div
              key={`rooms-slide-${i}`}
              className="embla__slide shrink-0 basis-full"
            >
              <div className="absolute grow h-[388px] bg-olive-dark"></div>
              <img
                className="w-full h-full object-cover transition-opacity duration-3000 relative"
                src={BASE_URL + img.variants.small}
                alt={`room-${slug}-${i}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <CarouselDots emblaRef={emblaRef} emblaApi={emblaApi}></CarouselDots>
    </div>

  );
}
