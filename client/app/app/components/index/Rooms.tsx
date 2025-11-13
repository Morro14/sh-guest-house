import { useMemo } from "react";
import { useFetchV3 } from "~/utils/fetchHook";
import { CarouselRoom } from "./CarouselRooms";
import Nav from "../nav/Nav";
import { useNavContextProvider } from "../nav/NavContextProvider";
import type { Image } from "~/types/nav";
import MediaFullView from "../MediaFullView";
import { Carousel } from "../carousel/Carousel";


export interface Room {
  slug: string;
  name: string;
  adults_num: number;
  children_num: number;
  images: Array<Image>;
}

export default function RoomsPreview() {
  const { fetchedData, loading } = useFetchV3("rooms");
  const data = fetchedData?.data.data as Array<Room>
  console.log("rooms data:", data)
  const context = useNavContextProvider();
  const roomCarousels = !loading ? (() => data.map((room) => {
    return (
      <div>

        <Carousel
          name="rooms"
          slug={room.slug}
          key={`room-carousel-${room.slug}`}
          images={room.images}

        ></Carousel>

        <MediaFullView images={room.images} slug={room.slug} key={`room-carousel-full-${room.slug}`}>

        </MediaFullView>
      </div>

    );
  })) : () => []
  const cachedRoomCarousels = useMemo(roomCarousels, [data])
  const currentRoomCarousel = cachedRoomCarousels[context.itemSelected]

  return loading ?
    <div className="flex justify-center items-center w-[688px] h-[388px] bg-olive-light text-gray-500 font-serif">
      Loading...
    </div>
    :
    <div className="flex justify-between">
      {currentRoomCarousel}
      <Nav items={data} slug="rooms" contextProvider={useNavContextProvider} template={NavLinkTemplate}></Nav>{" "}
    </div>
}

function NavLinkTemplate({ item }) {
  return <div>

    <div className="text-xl font-serif">{item.name}</div>
    <div className="flex gap-2" key={`${item.slug}-select-room-info`}>
      <div className="font-sans">{`${item.adults_num} Adults ${item.children_num} children`}</div>
      <div>|</div>
      <div className="font-sans" >Beds description</div>
    </div>
  </div>
} 
