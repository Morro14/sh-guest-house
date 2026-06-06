import { useFetchV3, useFetchWithTranslation } from "~/utils/fetchHook.ts";
import Nav from "../nav/Nav.tsx";
import { useNavContextProvider } from "../nav/NavContextProvider.tsx";
import type { Image } from "~/types/booking.ts";
import { useMemo, useState } from "react";
import MediaFullView from "../MediaFullView.tsx";
import { wikipediaLogo } from "~/components/svg/wikipediaLogo.tsx";
import { locationIcon } from "~/components/svg/locationIcon.tsx";
import { useTranslation } from "react-i18next";
import NavRows from "../nav/NavRows.tsx";
import { ImageLoading } from "../ImageLoading.tsx";

interface Place {
  slug: string;
  name: string;
  distance: number;
  distance_comment: "";
  images: Array<Image>;
  description: string;
  geoloc: string;
  info_link: string;
}

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;
export default function Places() {
  const { t, i18n } = useTranslation();
  const { fetchedData, loading } = useFetchWithTranslation({
    pathname: "content/places",
    dependencies: [i18n.language],
  });
  const data = fetchedData?.data?.data as Array<Place>;
  const context = useNavContextProvider();
  const images =
    !loading && data
      ? () =>
          data.map((place, index) => {
            return (
              <img
                key={`place-image-${index}-key`}
                className={`z-10 relative object-contain hover:cursor-pointer ${index === context.itemSelected ? "block" : "hidden"}`}
                src={MEDIA_URL + place.images[0]?.variants.small}
                onClick={() => {
                  context.setFullImageView(true);
                }}
              />
            );
          })
      : () => [];

  const imagesCached = useMemo(images, [images]);
  const currentImage = data ? imagesCached[context.itemSelected] : null;
  const currentPlace = data ? data[context.itemSelected] : undefined;
  const [opacity, setOpacity] = useState(100);
  // context.preStateChangeCallback = (callback: () => void) => {
  //   setOpacity(0);
  //   setTimeout(() => {
  //     setOpacity(100);
  //     callback();
  //   }, 150);
  // };
  return loading || !currentPlace || data.length === 0 ? (
    <div className="flex justify-center items-center w-[688px] h-[388px] bg-olive-light text-gray-500 font-serif">
      {!data || data.length === 0 ? t("No data") : t("Loading...")}
    </div>
  ) : (
    <div className="">
      {context.fullImageView ? (
        <MediaFullView>
          <ImageLoading
            imageAttrs={{
              src: data[context.itemSelected].images[0]?.variants.original,
              className: `object-contain`,
              onClick: () => {
                context.setFullImageView(true);
              },
              alt: `${data[context.itemSelected].images[0]?.alt_text}-photo-${context.itemSelected}`,
            }}
          ></ImageLoading>
        </MediaFullView>
      ) : (
        ""
      )}
      <div className="mb-9 2xl:mb-0 2xl:hidden">
        <NavRows
          items={data}
          slug="rooms"
          template={NavRowsLinkTemplate}
        ></NavRows>
      </div>
      <h3
        className={
          "transition-opacity duration-300 capitalize" + ` opacity-${opacity}`
        }
      >
        {currentPlace.name}
      </h3>
      <div className="flex items-center gap-4 font-sans font-[350] underline text-sm relative mb-5 -mt-1">
        <a
          href={currentPlace.info_link}
          className="flex items-center gap-1 hover:cursor-pointer"
        >
          <div className="relative b-[1px]">{wikipediaLogo}</div>
          <div className="">{t("wikipedia")}</div>
        </a>
        <a
          href={currentPlace.geoloc}
          className="flex items-center gap-1 hover:cursor-pointer"
        >
          <div className="relative bottom-0.5">{locationIcon}</div>
          <div>{t("location link")}</div>
        </a>
      </div>
      <div className="flex 2xl:flex-row md:pt-4 md:flex-col md:items-center 2xl:items-start md:gap-6 2xl:gap-0 w-full 2xl:justify-between">
        {/* <div className="image-frame-small-responsive absolute bg-gray-warm-light"></div> */}
        {/* <div */}
        {/*   className={ */}
        {/*     "flex max-2xl:justify-center max-2xl:w-full transition-opacity duration-300" + */}
        {/*     ` opacity-${opacity}` */}
        {/*   } */}
        {/* > */}
        <div className="carousel-small-width">
          {imagesCached.map((image) => image)}
        </div>
        {/* </div> */}
        <div className="max-2xl:hidden">
          <Nav items={data} template={NavLinkTemplate} slug="places"></Nav>
        </div>
      </div>
      <div
        className={
          "font-sans 2xl:text-lg carousel-small-width mt-8 transition-opacity duration-300" +
          ` opacity-${opacity}`
        }
      >
        {currentPlace.description}
      </div>
    </div>
  );
}

function NavLinkTemplate({ item, isSelected }) {
  return (
    <div
      className={`hover:cursor-pointer ${isSelected ? "font-medium border-gray-warm-light" : "font-normal"} px-3 py-1 transition-all h-[60px]`}
    >
      <div className="text-lg font-serif">{item.name}</div>
      <div className="font-sans">
        {item.distance +
          " km" +
          (item.distance_comment !== "" ? ` (${item.distance_comment})` : "")}
      </div>
    </div>
  );
}
function NavRowsLinkTemplate({ item, isSelected }) {
  return (
    <div
      className={`hover:cursor-pointer border-gray-warm-light border-b-2 border-collapse ${isSelected ? "font-medium border-b-2 border-x-0 border-t-0 border-peach" : "font-normal"} py-1 ease-out h-[50px] `}
    >
      <div className="text-base font-sans">{item.name}</div>
      <div className="font-sans text-sm">
        {item.distance +
          " km" +
          (item.distance_comment !== "" ? ` (${item.distance_comment})` : "")}
      </div>
    </div>
  );
}
