import MediaFullView from "../MediaFullView"
import AvailableRoom from "./AvailableRoom"
import type { Room } from "~/types/booking"
import { Carousel } from "../carousel/Carousel"
import { useNavContextProvider } from "../nav/NavContextProvider"
import { Form } from "react-router"
import FloatingPannel from "./FloatingPanel"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext"


export default function AvailableRooms({ rooms }) {
  const context = useNavContextProvider()
  const { t } = useTranslation()
  const formRef = useRef(null)
  const formContext = useBookingRoomSelectContextProvider()
  useEffect(() => formContext.setForm(formRef.current), [formRef])
  return <div className="flex flex-col items-center ">
    <h3 className='text-center text-nowrap my-7'>{rooms.length > 0 ? t('Available rooms') : t("No available rooms for these dates. Check the next available dates for booking below.")}</h3>
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
    <Form ref={formRef} id="room-select-form" className="grid grid-cols-2 2xl:w-[1000px] gap-x-10 gap-y-14">
      {rooms.map((room: Room, index: number) => {
        return <AvailableRoom formRef={formRef} key={room.name} room={room} index={index}></AvailableRoom>
      })
      }
      <button type="submit">Book</button>
    </Form>
  </div>
}
