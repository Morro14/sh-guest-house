import type { EmblaCarouselType } from "embla-carousel";
import arrowRight from "root/src/assets/grid-nav-arrow.svg";
import { useCarouselGridContextProvider } from "./CarouselGridContext";
import { useTranslation } from "react-i18next";
import { flushSync } from "react-dom";

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
    if (!gridContext.showMoreImages) {
      showMoreImages();
      return;
    }
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
        className="rotate-180 hover:cursor-pointer"
      >
        <img src={arrowRight} />
      </div>
      <div>
        <button
          className="text-gray-warm-mid text-sm font-sans hover:cursor-pointer underline"
          onClick={showMoreImages}
        >
          {gridContext.showMoreImages
            ? t("Show less images")
            : t("Show more images")}
        </button>
      </div>
      <div onClick={() => arrowFunc("right")} className="hover:cursor-pointer">
        <img src={arrowRight} />
      </div>
    </div>
  );
}
