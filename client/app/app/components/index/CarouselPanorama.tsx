import useEmblaCarousel from "embla-carousel-react";
import panoramaImg from "root/src/assets/panorama-2.png"
import { useEffect } from "react";


export function CarouselPanorama() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: 0,
    dragFree: true,
    // align: "center",
    loop: true,
  });
  // useEffect(() => console.log(emblaApi))
  const images = new Array(3).fill(panoramaImg)
  return (
    <div
      className="embla"
      ref={emblaRef}
    >
      <div className="embla__container ">
        {images.map((img, i) => {
          return <div
            key={`panorama-img-${i}`}
            className="embla__slide shrink-0"
          >
            <img
              className="w-auto h-full object-cover "
              // className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={img}
              alt={"panorama-2"}
            />
          </div>
        })
        }
      </div>
    </div>
  );
}
