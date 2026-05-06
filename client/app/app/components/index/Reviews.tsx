import { useFetchV3 } from "~/utils/fetchHook";
import type { Review } from "~/types/index";

export default function Reviews() {
  const { fetchedData } = useFetchV3("content/reviews?limit=3");
  const reviews: Review[] | undefined = fetchedData?.data?.results;
  return !reviews ? (
    ""
  ) : (
    <div className="flex md:gap-x-20 index-container-1 mt-11 h-70 pt-5 pb-8 border-t border-b border-gray-warm-light">
      {reviews.map((review, i) => {
        return (
          <div
            key={`review-${i}`}
            className="flex flex-col items-center w-[calc(100%/3)]"
          >
            <h5 className="mb-3">{review.date}</h5>
            <div className="text-center font-sans font-light max-h-48 overflow-hidden">
              {review.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
