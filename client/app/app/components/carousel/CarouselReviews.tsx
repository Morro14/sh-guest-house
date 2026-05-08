import useEmblaCarousel from "embla-carousel-react";
import type { Review as ReviewType } from "~/types";
import { useFetchV3 } from "~/utils/fetchHook";
import Review from "../index/Review";
import Placeholder from "../Placeholder";

export default function CarouselReviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const { fetchedData } = useFetchV3("content/reviews?limit=3");
  const reviews: ReviewType[] | undefined = fetchedData?.data?.results;
  return (
    <div className="index-container-1 my-11">
      <div className={`"embla__viewport overflow-hidden`} ref={emblaRef}>
        <div className={`embla__container`}>
          {reviews ? (
            reviews.map((item, i) => (
              <div
                key={`review-slide-${i}`}
                className="embla__slide shrink-0 basis-full"
              >
                <Review review={item} index={i}></Review>
              </div>
            ))
          ) : (
            <Placeholder></Placeholder>
          )}
        </div>
      </div>
    </div>
  );
}
