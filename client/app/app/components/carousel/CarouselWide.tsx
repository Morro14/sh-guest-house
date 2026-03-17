import { useFetchV3 } from "~/utils/fetchHook";
import MediaFullView from "../MediaFullView";
import { useNavContextProvider } from "../nav/NavContextProvider";
import type { Image } from "~/types/booking";
import type { ImageRes } from "~/types/general";
import useEmblaCarousel from "embla-carousel-react";
import { ImageLoading } from "../ImageLoading";

export default function CarouselWide({ tag }: { tag: string }) {
  const { fetchedData, loading } = useFetchV3("content/wide-images/" + tag);
  const images = fetchedData?.data?.data as Array<Image>;
  const context = useNavContextProvider();
  const [emblaRef] = useEmblaCarousel({
    startSnap: 1,
    align: "center",
    loop: true,
  });
  const imageRes: ImageRes = "main";
  return loading || !images ? (
    <WideImagePlaceholder />
  ) : (
    <div>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {images.concat(images).map((img, i) => (
            <div
              key={`img-wide-${i}`}
              className="embla__slide shrink-0 mr-3 carousel-wide-image"
            >
              <img
                className="object-cover hover:cursor-pointer"
                src={img.variants[imageRes]}
                alt={"photo" + "-" + i}
                onClick={() => {
                  context.setFullImageView(true);
                  context.setItemSelected(i % 3);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {context.fullImageView ? (
        <MediaFullView>
          <ImageLoading
            attributes={{
              className: "h-full object-cover",
              src: images[context.itemSelected]["variants"]["original"],
              alt:
                images[context.itemSelected].alt_text +
                "-" +
                context.itemSelected +
                "-full",
            }}
          ></ImageLoading>
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
