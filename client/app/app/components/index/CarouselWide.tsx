import { useFetchV3 } from "~/utils/fetchHook"
import MediaFullView from "../MediaFullView"
import NavContextProvider, { useNavContextProvider } from "../nav/NavContextProvider"
import { CarouselMain } from "./CarouselMain"
import type { Image } from "~/types/nav"

const MEDIA_BASE_URL = import.meta.env.VITE_SERVER_URL


export default function CarouselWide() {
  const context = useNavContextProvider()
  console.log(context.itemSelected)
  const { fetchedData, loading } = useFetchV3("wide-images")
  const images = fetchedData?.data?.data as Array<Image>
  console.log('images', images)
  return !images ? <WideImagePlaceholder /> :
    <div>
      <CarouselMain images={images.concat(images)} imageSize="main" name="wide-1"></CarouselMain>
      <MediaFullView images={images} slug="wide" imageSize="full">
        <img src={MEDIA_BASE_URL + images[context.itemSelected]["variants"]["full"]} />

      </MediaFullView>

    </div>
}

function WideImagePlaceholder() {
  console.log('wide image placesholder')
  return <div className="flex gap-5 overflow-hidden w-screen">
    <div className="2xl:w-[1052px] 2xl:h-[368px] bg-gray-warm"></div>
    <div className="2xl:w-[1052px] 2xl:h-[368px] bg-gray-warm"></div>
    <div className="2xl:w-[1052px] 2xl:h-[368px] bg-gray-warm"></div>
  </div>
}
