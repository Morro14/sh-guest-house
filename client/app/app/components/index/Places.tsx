import { useFetchV3 } from "~/utils/fetchHook.ts";
import Nav from "../nav/Nav.tsx";
import { useNavContextProvider } from "../nav/NavContextProvider.tsx";
import type { Image } from "~/types/nav.ts";
import { useMemo, useState } from "react";
import MediaFullView from "../MediaFullView.tsx";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

interface Place {
  slug: string;
  name: string;
  distance: number;
  distance_comment: "";
  images: Array<Image>;
  description: string;
}

export default function Places() {
  const { fetchedData, loading } = useFetchV3("places");
  const data = fetchedData?.data.data as Array<Place>;
  console.log("places data:", data);
  const context = useNavContextProvider();
  const images = !loading
    ? () =>
        data.map((place) => {
          return (
            <img
              className="z-10 relative"
              src={BASE_URL + place.images[0].variants.small}
              onClick={() => {
                context.setFullImageView(true);
              }}
            />
          );
        })
    : () => [];
  const imagesCached = useMemo(images, [images]);
  const currentImage = imagesCached[context.itemSelected];
  const currentPlace = data ? data[context.itemSelected] : undefined;
  const [opacity, setOpacity] = useState(100);
  context.preStateChangeCallback = (callback: () => void) => {
    setOpacity(0);
    setTimeout(() => {
      setOpacity(100);
      callback();
    }, 150);
  };
  return loading ? (
    <div className="flex justify-center items-center w-[688px] h-[388px] bg-olive-light text-gray-500 font-serif">
      Loading...
    </div>
  ) : data.length === 0 ? (
    <div className="">
      <p>No information found. Come back to check later!</p>
    </div>
  ) : (
    <div className=" mb-10">
      {context.fullImageView ? (
        <MediaFullView>
          <img
            src={
              BASE_URL +
              data[context.itemSelected]["images"][0]["variants"]["original"]
            }
          />
        </MediaFullView>
      ) : (
        ""
      )}
      <h3
        className={
          "transition-opacity duration-300 capitalize" + ` opacity-${opacity}`
        }
      >
        {currentPlace ? currentPlace.name : ""}
      </h3>
      <div className="flex justify-between">
        <div className="image-frame-small-responsive  absolute bg-gray-warm-light"></div>
        <div
          className={
            "image-frame-small-responsive transition-opacity duration-300" +
            ` opacity-${opacity}`
          }
        >
          {currentImage}
        </div>
        <Nav
          items={data}
          contextProvider={useNavContextProvider}
          template={NavLinkTemplate}
          slug="places"
        ></Nav>
      </div>
      <div
        className={
          "image-frame-small-responsive font-sans 2xl:text-lg mt-8 transition-opacity duration-300" +
          ` opacity-${opacity}`
        }
      >
        {currentPlace ? currentPlace.description : "No description found."}
      </div>
    </div>
  );
}

function NavLinkTemplate({ item }) {
  return (
    <div className="flex flex-col">
      <div className="text-xl font-serif">{item.name}</div>
      <div className="font-sans">
        {item.distance +
          " km" +
          (item.distance_comment !== "" ? ` (${item.distance_comment})` : "")}
      </div>
    </div>
  );
}
