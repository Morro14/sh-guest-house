import useEmblaCarousel from "embla-carousel-react";
import type { Image } from "~/types/booking";
import CarouselDots from "./CarouselDots";
import { useNavContextProvider } from "../nav/NavContextProvider";
import CarouselDotsFullView from "./CarouselDotsFullView";
import { ImageLoading } from "../ImageLoading";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export function Carousel({
  name,
  images,
  imageRes,
  fullView = false,
  border = false,
  display = true,
}: {
  name: string;
  images: Array<Image>;
  imageRes: "small" | "blur" | "main" | "original";
  fullView?: boolean;
  border?: boolean;
  display?: boolean;
}) {
  const context = useNavContextProvider();
  const startSnap = fullView ? context.imageSelected : 0;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startSnap: Number(startSnap),
  });
  const imageOnClick = (imageIndex: number) => {
    if (!fullView) {
      context.setFullImageView(true);
      context.setImageSelected(imageIndex);
    } else {
      return;
    }
  };
  return fullView ? (
    <div className="flex flex-col gap-5 items-center justify-end shrink h-full max-w-[80vw] md:max-w-[70vw] xl:max-w-[65vw] 2xl:max-w-[60vw]">
      <div className="embla bg-black-transparent border-2 border-peach size-full">
        <div className="embla__viewport size-full" ref={emblaRef}>
          <div className={`embla__container  size-full`}>
            {images.map((img, i) => (
              <div
                key={`${name}-slide-${i}`}
                className="embla__slide shrink-0 grow basis-full h-full flex justify-center items-center"
              >
                <ImageLoading
                  imageAttrs={{
                    className: "h-full object-contain",
                    src: `${MEDIA_URL}${img.variants[imageRes]}`,
                    onClick: () => imageOnClick(i),
                    alt: `${name}-${i}`,
                  }}
                ></ImageLoading>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sticky">
        {/* <CarouselDots emblaRef={emblaRef} emblaApi={emblaApi}></CarouselDots> */}
        <CarouselDotsFullView
          emblaApi={emblaApi}
          snapListLen={images.length}
        ></CarouselDotsFullView>
      </div>
    </div>
  ) : (
    <div
      className={`embla ${display ? "flex" : "hidden"} flex-col gap-5 2xl:w-full md:w-[688px]`}
    >
      <div
        className={`"embla__viewport overflow-hidden carousel-small ${border ? "border-2 border-peach" : ""}`}
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
                  src={img.variants[imageRes]}
                  alt={`${name}-${i}`}
                  loading="lazy"
                  onClick={() => imageOnClick(i)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <CarouselDots
        emblaApi={emblaApi}
        snapListLen={images.length}
      ></CarouselDots>
    </div>
  );
}
