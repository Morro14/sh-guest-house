import { useFetchV3 } from "~/utils/fetchHook";
import type { Review } from "~/types/index";

export default function Reviews() {
  const { fetchedData } = useFetchV3("content/reviews?limit=3");
  const reviews: Review[] | undefined = fetchedData?.data?.results;
  console.log("reviews", reviews);
  return !reviews ? (
    ""
  ) : (
    <div className="flex gap-28 index-container-1 m-4">
      {reviews.map((review) => {
        return (
          <div className="flex flex-col items-center w-[calc(100%/3)]">
            <h5 className="mb-3">{review.date}</h5>
            <div className="text-center">{review.content}</div>
          </div>
        );
      })}
    </div>
  );
}
