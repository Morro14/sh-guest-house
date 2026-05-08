import { useFetchV3 } from "~/utils/fetchHook";
import type { Review } from "~/types/index";

export default function Review({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  return !review ? (
    ""
  ) : (
    <div className="">
      <div key={`review-${index}`} className="flex flex-col items-center">
        <h5 className="mb-3">{review.date}</h5>
        <div className="text-center font-sans font-light max-h-48 overflow-hidden">
          {review.content}
        </div>
      </div>
    </div>
  );
}
