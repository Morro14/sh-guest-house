import useEmblaCarousel from "embla-carousel-react";
import { useNavContextProvider } from "../nav/NavContextProvider";
import type { Image } from "~/types/nav";


const SERVER_URL = import.meta.env.VITE_SERVER_URL

export function CarouselMain({ images, imageSize, name }: { images: Array<Image>, imageSize: "small" | "main", name: string }) {
  const context = useNavContextProvider()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 1,
    align: "center",
    loop: true,
  });
  return (
    <div
      className="embla"
      ref={emblaRef}
    >
      <div className="embla__container">
        {images.map((img, i) => (
          <div
            key={`img-frame-1i${i}`}
            className="embla__slide shrink-0 mr-3 basis-[1052px]"
          >
            <img
              className="object-cover"
              src={SERVER_URL + img.variants[imageSize]}
              alt={"landscape-1" + "-" + i}
              onClick={() => { context.setFullImageView(true); context.setItemSelected(i % 3) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
