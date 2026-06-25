import useEmblaCarousel from "embla-carousel-react";
import type { Review as ReviewType } from "~/types";
import { useFetchWithTranslation } from "~/utils/fetchHook";
import Review from "../index/Review";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PlaceholderGrayBox from "../placeholders/PlaceholderGrayBox";

export default function CarouselReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const { t, i18n } = useTranslation();
  const { fetchedData } = useFetchWithTranslation({
    pathname: "content/reviews?limit=5",
    dependencies: [i18n.language],
  });
  const reviews: ReviewType[] | undefined = fetchedData?.data?.results;

  // autoplay
  const [autoScroll, setAutoScroll] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!emblaApi || autoScroll) {
      return;
    }

    const interval = setInterval(() => {
      emblaApi.goToNext();
    }, 6000);
    emblaApi.on("pointerdown", () => {
      clearInterval(interval);
    });
    setAutoScroll(interval);
  }, [autoScroll, emblaApi]);
  return (
    <div className="border-t border-b border-gray-warm-light">
      <div className="index-container-1 pb-2">
        <div className={`"embla__viewport overflow-hidden`} ref={emblaRef}>
          <div className={`embla__container`}>
            {reviews ? (
              reviews.map((item, i) => (
                <div
                  key={`review-slide-${i}`}
                  className="embla__slide shrink-0 basis-full 2xl:basis-[calc(100%/3-32px)] mx-4 "
                >
                  <Review review={item} index={i}></Review>
                </div>
              ))
            ) : (
              <PlaceholderGrayBox></PlaceholderGrayBox>
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex w-full justify-between px-4 pt-2"> */}
      {/*   <button */}
      {/*     className="text-sm text-gray-warm-mid" */}
      {/*     onClick={() => { */}
      {/*       clearInterval(autoScroll); */}
      {/*       emblaApi.goToPrev(); */}
      {/*     }} */}
      {/*   > */}
      {/*     {t("prev")} */}
      {/*   </button> */}
      {/*   <button */}
      {/*     className="text-sm text-gray-warm-mid" */}
      {/*     onClick={() => { */}
      {/*       clearInterval(autoScroll); */}
      {/*       emblaApi.goToNext(); */}
      {/*     }} */}
      {/*   > */}
      {/*     {t("next")} */}
      {/*   </button> */}
      {/* </div> */}
    </div>
  );
}
