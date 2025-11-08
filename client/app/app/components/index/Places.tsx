import { useFetchV3 } from "~/utils/fetchHook.ts";
import Nav from "../nav/Nav.tsx";
import { useNavContextProvider } from "../nav/NavContextProvider.tsx";
import type { Image } from "~/types/nav.ts";
import { useMemo, useRef, useState } from "react";
import Paragraph from "./Paragraph.tsx";


const BASE_URL = import.meta.env.VITE_SERVER_URL

interface Place {
  slug: string;
  name: string;
  distance: number;
  distance_comment: "";
  images: Array<Image>;
  description: string;
}

export default function Places() {
  const { fetchedData, loading } = useFetchV3("places")
  const data = fetchedData?.data.data as Array<Place>
  console.log("places data:", data)
  const context = useNavContextProvider()
  const images = !loading ? () => data.map((place) => {
    return <img src={BASE_URL + place.images[0].variants.small} />
  }) : () => []
  const imagesCached = useMemo(images, [data])
  const currentImage = imagesCached[context.itemSelected]
  const currentPlace = data ? data[context.itemSelected] : undefined
  // const imageRef = useRef(null)
  // const textRef = useRef(null)
  // const titleRef = useRef(null)
  // const callbackRefs = [titleRef, textRef, imageRef]
  const [opacity, setOpacity] = useState(100)
  context.preStateChangeCallback = (callback: () => void) => {
    setOpacity(0)
    setTimeout(() => {
      setOpacity(100)
      callback()
    },
      300
    )
  }
  return loading ?
    <div className="flex justify-center items-center w-[688px] h-[388px] bg-olive-light text-gray-500 font-serif">
      Loading...
    </div>
    :
    <div className=" mb-10">
      <h3 className={"transition-opacity duration-300" + ` opacity-${opacity}`}>{currentPlace ? currentPlace.name : ""}</h3>
      <div className="flex justify-between">
        <div className={"image-frame-small-responsive transition-opacity duration-300" + ` opacity-${opacity}`}>
          {currentImage}
        </div>
        <Nav items={data} contextProvider={useNavContextProvider} template={NavLinkTemplate} slug="places"></Nav>
      </div >
      <div className={"image-frame-small-responsive font-sans 2xl:text-lg mt-8 transition-opacity duration-300" + ` opacity-${opacity}`}>
        {currentPlace ? currentPlace.description : "No description found."}
      </div>
    </div>
}

function NavLinkTemplate({ item }) {
  return <div className="flex flex-col px-2">
    <div className="text-xl font-serif">{item.name}</div>
    <div className="font-serif">{item.distance + " km" + (item.distance_comment !== "" ? ` (${item.distance_comment})` : "")}</div>
  </div>
}
