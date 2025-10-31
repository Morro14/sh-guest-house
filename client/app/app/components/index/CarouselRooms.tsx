import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { useRoomContextProvider } from "./RoomsContextProvider";
import type { Image, Room } from "./Rooms";

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
    <div
      key={`rooms-slider-container-${slug}`}
      className="embla "
      ref={emblaRef}
    >
      <div
        className="embla__container w-[688px] h-[388px]"
        key={`rooms-embla-container-${slug}`}
      >
        {images.map((img, i) => (
          <div
            key={`rooms-slide-${i}`}
            className="embla__slide shrink-0 basis-full"
          >
            {/* <img
							className="w-full h-full object-cover absolute blur-sm"
							src={isActive ? BASE_URL + img.variants.blur : undefined}
							alt={`room-${slug}-blur-${i}`}
							key={`room-${slug}-${i}`}
							loading={isActive ? "eager" : "lazy"}
						/> */}
            <div className="absolute grow h-[388px] bg-olive-dark"></div>
            <img
              className="w-full h-full object-cover transition-opacity duration-3000 relative"
              src={BASE_URL + img.variants.small}
              alt={`room-${slug}-${i}`}
              loading="lazy"
              key={"room" + img}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
