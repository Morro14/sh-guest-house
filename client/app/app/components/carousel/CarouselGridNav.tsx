import type { EmblaCarouselType } from "embla-carousel";
import arrowRight from "root/src/assets/grid-nav-arrow.svg";
import { useCarouselGridContextProvider } from "./CarouselGridContext";
import { useTranslation } from "react-i18next";

export default function CarouselGridNav({
  emblaApi,
}: {
  emblaApi: EmblaCarouselType;
}) {
  const gridContext = useCarouselGridContextProvider();
  const { t } = useTranslation();
  const arrowFunc = (direction: "left" | "right") => {
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
          onClick={() =>
            gridContext.setShowMoreImages(!gridContext.showMoreImages)
          }
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
