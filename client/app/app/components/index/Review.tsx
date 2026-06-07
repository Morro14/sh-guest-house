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
    <div className="p-3 rounded-sm">
      <div key={`review-${index}`} className="flex flex-col items-center">
        <h5 className="mb-3">{review.date}</h5>
        <div className="text-center text-[15px] font-sans italic max-h-46 text-pretty overflow-hidden starting:opacity-0 opacity-100 transition-opacity duration-300 whitespace-pre-wrap">
          {review.content}
        </div>
      </div>
    </div>
  );
}
