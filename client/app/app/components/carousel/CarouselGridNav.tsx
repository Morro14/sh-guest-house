import type { EmblaCarouselType } from "embla-carousel";
import arrowRight from "root/src/assets/grid-nav-arrow.svg";
import { useCarouselGridContextProvider } from "./CarouselGridContext";
import { useTranslation } from "react-i18next";
import { flushSync } from "react-dom";
import imagesIcon from "src/assets/images-icons.svg";

export default function CarouselGridNav({
  emblaApi,
}: {
  emblaApi: EmblaCarouselType;
}) {
  const gridContext = useCarouselGridContextProvider();
  const { t } = useTranslation();

  const showMoreImages = () => {
    flushSync(() => {
      gridContext.setShowMoreImages(!gridContext.showMoreImages);
      if (!gridContext.showMoreImages) {
        gridContext.setSideGridsDelayedShow(true);
      }
    });
    if (gridContext.showMoreImages) {
      setTimeout(() => gridContext.setSideGridsDelayedShow(false), 300);
    }
  };

  const arrowFunc = (direction: "left" | "right") => {
    // if (!gridContext.showMoreImages) {
    //   showMoreImages();
    //   return;
    // }
    if (direction === "left") {
      emblaApi.goToPrev();
    } else {
      emblaApi.goToNext();
    }
  };
  return (
    <div className="flex gap-10">
      <div
        onClick={() => arrowFunc("left")}
        className=" hover:cursor-pointer h-11"
      >
        <img src={arrowRight} className="rotate-180 relative -bottom-4" />
      </div>
      <div>
        <button
          className="text-gray-warm-mid flex flex-col items-center gap-1 text-sm font-sans hover:cursor-pointer underline hover:text-accent transition-colors"
          onClick={showMoreImages}
        >
          <img className="h-5" src={imagesIcon} />
          <div>
            {gridContext.showMoreImages
              ? t("Show less images")
              : t("Show more images")}
          </div>
        </button>
      </div>
      <div
        onClick={() => arrowFunc("right")}
        className="hover:cursor-pointer h-11"
      >
        <img src={arrowRight} className="relative -bottom-4" />
      </div>
    </div>
  );
}
