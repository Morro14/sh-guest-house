import MediaFullView from "../MediaFullView"
import AvailableRoom from "./AvailableRoom"
import type { Room } from "~/types/booking"
import { Carousel } from "../carousel/Carousel"
import { useNavContextProvider } from "../nav/NavContextProvider"
import { useState } from "react"


export default function AvailableRooms({ rooms }) {
  const context = useNavContextProvider()
  return <div className="flex justify-center">
    {
      context.fullImageView ? <MediaFullView>
        <Carousel
          name={rooms[context.itemSelected]}
          images={rooms[context.itemSelected].images}
          imageRes="original"
          imageSize="full"
          fullView={true}
        >
        </Carousel>
      </MediaFullView> : ""
    }
    <div className="grid grid-cols-2 2xl:w-[1000px] gap-x-10 gap-y-14">
      {rooms.map((room: Room, index: number) => {
        return <AvailableRoom key={room.name} room={room} index={index}></AvailableRoom>
      })
      }
    </div>
  </div>
}
