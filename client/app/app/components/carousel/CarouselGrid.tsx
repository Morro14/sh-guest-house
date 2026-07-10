import useEmblaCarousel from "embla-carousel-react";
import ImageGrid from "./ImageGrid";

import { useFetchV3 } from "~/utils/fetchHook";
import type { Grid } from "~/types/grid";
import { useCarouselGridContextProvider } from "./CarouselGridContext";
import MediaFullView from "../MediaFullView";
import { ImageLoading } from "../ImageLoading";
import { useNavContextProvider } from "../nav/NavContextProvider";
import CarouselGridNav from "./CarouselGridNav";
import { useEffect } from "react";
import PlaceholderFullView from "~/components/placeholders/PlaceholderFullView";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export default function CarouselGrid({ name }: { name: string }) {
  const { fetchedData } = useFetchV3("content/image-grids");
  const gridData = fetchedData?.data?.data as Grid[];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });
  const gridContext = useCarouselGridContextProvider();
  const navContext = useNavContextProvider();
  const gridsConcat =
    gridData && gridData.length < 3
      ? [...gridData, ...Array(3 - gridData.length).fill(0)]
      : !gridData
        ? Array(6).fill(0)
        : gridData;
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width:768px)");
    if (isMobile.matches) {
      gridContext.setShowMoreImages(true);
    }
    isMobile.addEventListener("change", () => {
      if (isMobile.matches) {
        gridContext.setShowMoreImages(true);
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-center md:gap-8 gap-4">
      <div className="embla max-w-screen " ref={emblaRef}>
        <div className="embla__container">
          {gridsConcat.map((grid: Grid | 0, i) => (
            <div
              className={`embla__slide 2xl:mx-1.5 md:mx-1 mx-0.5 shrink-0 transition-opacity duration-300 ease-out`}
              key={`carousel-${name}-image-grid-${i}`}
            >
              <ImageGrid
                grid={grid}
                gridIndex={i}
                gridLen={gridData?.length}
              ></ImageGrid>
            </div>
          ))}
        </div>
      </div>
      <div className="index-container-1 flex justify-center">
        <CarouselGridNav emblaApi={emblaApi}></CarouselGridNav>
      </div>
      {navContext.fullImageView && gridContext.fullView ? (
        <MediaFullView>
          <div className="h-[90vh]">
            <ImageLoading
              placeholderLoading=<PlaceholderFullView></PlaceholderFullView>
              imageAttrs={{
                src: `${MEDIA_URL}${gridContext.fullView.variants.original}`,
                className: "h-full object-contain",
              }}
            ></ImageLoading>
          </div>
        </MediaFullView>
      ) : (
        ""
      )}
    </div>
  );
}
