import { useMemo, useState } from "react";
import { useFetchV3 } from "~/utils/fetchHook";
import { CarouselRoom } from "./CarouselRooms";
import Nav from "../nav/Nav";
import RoomsContextProvider from "./RoomsContextProvider";
import { useRoomContextProvider } from "./RoomsContextProvider";
export interface Image {
  order: number;
  variants: { blur: string; small: string; main: string };
}
export interface Room {
  slug: string;
  name: string;
  adults_num: number;
  children_num: number;
  images: Array<Image>;
}

export default function RoomsPreview({ params }: any) {
  const { fetchedData, loading } = useFetchV3("rooms");
  const data = fetchedData?.data.data as Array<Room>
  if (!loading) {
    console.log("rooms", fetchedData);
  }
  const context = useRoomContextProvider();
  const roomCarousels = !loading ? (() => data.map((room) => {
    return (
      <CarouselRoom
        slug={room.slug}
        key={`room-carousel-${room.slug}`}
        images={room.images}
      ></CarouselRoom>
    );
  })) : () => []
  const cachedRoomCarousels = useMemo(roomCarousels, [data])
  const currentRoomCarousel = cachedRoomCarousels[context.roomSelected]
  return loading ?
    <div className="flex justify-center items-center w-[688px] h-[388[x] bg-olive-light text-gray-500 font-serif">
      Loading...
    </div>
    :
    <div>
      <div className="flex justify-between">
        {currentRoomCarousel}
        <Nav rooms={data}></Nav>{" "}
      </div>
    </div>
}
