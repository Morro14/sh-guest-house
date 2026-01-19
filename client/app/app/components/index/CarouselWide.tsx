import { useFetchV3 } from "~/utils/fetchHook";
import MediaFullView from "../MediaFullView";
import { useNavContextProvider } from "../nav/NavContextProvider";
import { CarouselMain } from "./CarouselMain";
import type { Image } from "~/types/nav";

const MEDIA_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function CarouselWide() {
  const context = useNavContextProvider();
  const { fetchedData, loading } = useFetchV3("wide-images");
  const images = fetchedData?.data?.data as Array<Image>;
  return loading ? (
    <WideImagePlaceholder />
  ) : (
    <div>
      <CarouselMain
        images={images.concat(images)}
        imageSize="main"
        name="wide-1"
      ></CarouselMain>
      {context.fullImageView ? (
        <MediaFullView>
          <img
            className="h-full object-cover"
            src={
              MEDIA_BASE_URL +
              images[context.itemSelected]["variants"]["original"]
            }
          />
        </MediaFullView>
      ) : (
        ""
      )}
    </div>
  );
}

function WideImagePlaceholder() {
  return (
    <div className="flex gap-5 overflow-hidden w-screen">
      <div className="2xl:w-[1052px] 2xl:h-[368px] bg-gray-warm"></div>
      <div className="2xl:w-[1052px] 2xl:h-[368px] bg-gray-warm"></div>
      <div className="2xl:w-[1052px] 2xl:h-[368px] bg-gray-warm"></div>
    </div>
  );
}
