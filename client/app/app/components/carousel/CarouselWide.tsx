import { useFetchV3 } from "~/utils/fetchHook";
import MediaFullView from "../MediaFullView";
import { useNavContextProvider } from "../nav/NavContextProvider";
import type { Image } from "~/types/booking";
import type { ImageRes } from "~/types/general";
import useEmblaCarousel from "embla-carousel-react";
import { ImageLoading } from "../ImageLoading";
import Spinner from "../status/Spinner";
import Placeholder from "../Placeholder";

const MEDIA_URL_BASE = import.meta.env.VITE_MEDIA_BASE_URL;

export default function CarouselWide({ tag }: { tag: string }) {
  const { fetchedData } = useFetchV3("content/wide-images/" + tag);
  const images = fetchedData?.data?.data as Array<Image>;
  const imagesDefault = images ? images : [];
  const context = useNavContextProvider();
  const [emblaRef] = useEmblaCarousel({
    startSnap: 1,
    align: "center",
    loop: true,
  });
  const imageRes: ImageRes = "main";
  return !images ? (
    <div className="index-container-1 mx-auto">
      <Placeholder></Placeholder>
    </div>
  ) : (
    <div>
      <div className="embla max-w-screen" ref={emblaRef}>
        <div className="embla__container">
          {imagesDefault.map((img, i) => (
            <div
              key={`img-wide-${i}`}
              className="embla__slide shrink-0 mr-3 carousel-wide-image 2xl:h-[388px] md:h-[220px] h-[110px] w-full overflow-hidden"
            >
              <ImageLoading
                imageAttrs={{
                  className:
                    "object-cover hover:cursor-pointer size-full hover:scale-102 origin-center transition-scale duration-600",
                  src: `${MEDIA_URL_BASE + img.variants[imageRes]}`,
                  alt: `img-place-wide-${i}`,

                  onClick: () => {
                    context.setFullImageView(true);
                    context.setItemSelected(i % 3);
                  },
                }}
                placeholder={<Placeholder></Placeholder>}
              ></ImageLoading>
            </div>
          ))}
        </div>
      </div>
      {context.fullImageView ? (
        <MediaFullView>
          <ImageLoading
            placeholder={<Spinner variation="white"></Spinner>}
            imageAttrs={{
              className: "h-full object-contain",
              src: `${MEDIA_URL_BASE}${images[context.itemSelected]["variants"]["original"]}`,
              alt: `${images[context.itemSelected].alt_text}-${
                context.itemSelected
              }-full`,
            }}
          ></ImageLoading>
        </MediaFullView>
      ) : (
        ""
      )}
    </div>
  );
}
