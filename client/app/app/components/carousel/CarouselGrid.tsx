import useEmblaCarousel from "embla-carousel-react";
import ImageGrid from "./ImageGrid";

import { useFetchV3 } from "~/utils/fetchHook";
import type { GridImage } from "~/types/grid";
import { Grid } from "~/types/grid";
import { useCarouselGridContextProvider } from "./CarouselGridContext";
import MediaFullView from "../MediaFullView";
import { ImageLoading } from "../ImageLoading";
import { useNavContextProvider } from "../nav/NavContextProvider";
import { useTranslation } from "react-i18next";
import CarouselGridNav from "./CarouselGridNav";
import { useEffect, useState } from "react";

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export default function CarouselGrid({ name }: { name: string }) {
  const { fetchedData } = useFetchV3("content/grid-images");
  const images = fetchedData?.data?.data as GridImage[];
  // test
  const imagesConcat = images ? images.concat(images).concat(images) : images;
  function distImagesIntoGrids(images: GridImage[]) {
    const gridInit = new Grid();
    const grids: Grid[] = [gridInit];
    // console.log("grids", grids);
    // console.log("images", images);
    if (!images) {
      return grids;
    }
    images.forEach((image) => {
      const targetGrid = grids.find((grid: Grid) =>
        grid.hasFreeImageSlot(image),
      );
      if (!targetGrid) {
        const newGrid = new Grid();
        newGrid.addImage(image);
        grids.push(newGrid);
      } else {
        targetGrid.addImage(image);
      }
    });
    return grids;
  }
  const gridInstances = distImagesIntoGrids(imagesConcat);
  const gridElements = gridInstances.map((grid, i) => (
    <ImageGrid grid={grid} gridIndex={i}></ImageGrid>
  ));
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });
  const gridContext = useCarouselGridContextProvider();
  const navContext = useNavContextProvider();
  useEffect(() => {
    gridContext.setSideGridsVisible(gridContext.showMoreImages);
  }, [gridContext.showMoreImages]);
  return (
    <div className="flex flex-col items-center gap-11">
      <div className="embla max-w-screen " ref={emblaRef}>
        <div className="embla__container">
          {gridElements.map((grid, i) => (
            <div
              // ${!gridContext.showMoreImages && i > 0 ? "hidden" : "block"}
              className={`embla__slide 2xl:mx-1.5 md:mx-1 mx-0.5 shrink-0 transition-opacity duration-300 ease-out`}
              key={`carousel-${name}-image-grid-${i}`}
            >
              {grid}
            </div>
          ))}
        </div>
      </div>
      <div className="index-container-1 flex justify-center">
        <CarouselGridNav emblaApi={emblaApi}></CarouselGridNav>
      </div>
      {navContext.fullImageView && gridContext.fullView ? (
        <MediaFullView>
          <ImageLoading
            imageAttrs={{
              src: `${MEDIA_URL}${gridContext.fullView.variants.original}`,
              className: "h-full object-contain",
            }}
          ></ImageLoading>
        </MediaFullView>
      ) : (
        ""
      )}
    </div>
  );
}
