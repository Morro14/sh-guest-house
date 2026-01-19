import MediaFullView from "../MediaFullView"
import AvailableRoom from "./AvailableRoom"
import type { Room } from "~/types/booking"
import { Carousel } from "../carousel/Carousel"
import { useNavContextProvider } from "../nav/NavContextProvider"
import { Form, useLocation, useSearchParams } from "react-router"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext"

export default function AvailableRooms({ rooms }) {
  const context = useNavContextProvider()
  const { t } = useTranslation()
  const formRef = useRef(null)
  const formContext = useBookingRoomSelectContextProvider()
  const [URLSearchParams] = useSearchParams()
  const location = useLocation()
  useEffect(() => {
    // reset form context states if new search params
    formContext.setGuestPool({ adults: Number(URLSearchParams.get('adults')), children: Number(URLSearchParams.get('children')) })
  }, [URLSearchParams])
  // useEffect(() => {
  //   formContext.setForm(formRef.current)
  // }, [])
  console.log('location', location.pathname)
  return <div id="available-rooms" className="flex flex-col items-center pt-14">
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
    <Form method="post" ref={(node) => {formRef.current=node; formContext.setForm(node)}} key={URLSearchParams.toString()} id="room-select-form" className="grid grid-cols-2 2xl:w-[1000px] gap-x-10 gap-y-14">
      {rooms.map((room: Room, index: number) => {
        return <AvailableRoom formRef={formRef} key={room.name} room={room} index={index}></AvailableRoom>
      })
      }
      <button type="submit">Book</button>
    </Form>
  </div>
}
