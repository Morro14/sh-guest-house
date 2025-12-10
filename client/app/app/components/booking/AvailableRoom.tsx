import type { Room } from "~/types/booking"
import { useNavContextProvider } from "../nav/NavContextProvider"
import { useSearchParams } from "react-router"
import { isDigit, formatPrice } from "~/utils/general"
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext"
import { getSelectedRooms } from "../formComponents/utils"


const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function AvailableRoom({ room, index, formRef }: { room: Room, index: number, formRef: React.RefObject<HTMLFormElement> }) {

  const [urlParams] = useSearchParams()
  const days = urlParams.get("days")
  const daysNum = days && isDigit(days) ? Number(days) : 1
  const navContext = useNavContextProvider()
  const formContext = useBookingRoomSelectContextProvider()
  return <div key={room.name}>
    <img className="border-2 border-peach object-cover w-[482px] h-[272px]" src={`${SERVER_URL}/${room.images[0].variants.small}`} onClick={() => { navContext.setFullImageView(true); navContext.setItemSelected(index) }} />
    <div className="flex flex-col gap-2 mt-2">
      <h4>{room.name}</h4>
      <div className="font-sans grid grid-cols-10 text-base">
        <span className="flex items-center col-span-2 font-light">Guests</span>
        <span className="flex items-center col-span-8 ">{room.adults_num + room.children_num}</span>
        <span className="flex items-center col-span-2 -mt-1 font-light">Beds</span>
        <span className="flex items-center col-span-8 -mt-1 font-light">{room.beds.slice(0, 20)}</span>
      </div>
      <div className="flex items-end gap-32">
        <div className="flex flex-col">
          <div className="font-sans text-base font-light">For one night:</div>
          <span className="font-serif text-green-warm text-xl -mt-1">{`${formatPrice(room.price, "AMD")}`}</span>
        </div>
        {daysNum > 1 ?
          <div className="flex flex-col">
            <div className="font-sans text-base font-light">{`For ${daysNum} nights:`}</div>
            <div className="flex items-end">
              <span className="font-serif text-green-warm text-xl -mt-1">{`${formatPrice(room.price * daysNum, "AMD")}`}</span>
            </div>
          </div>
          : ""}
      </div>
    </div>
    <div className="flex justify-center items-center mt-4 border-y-1 border-gray-warm h-11">
      <input value={room.slug} onChange={() => formContext.setSelectedRooms(getSelectedRooms(formRef?.current))} id={`room-checkbox-${index}`} className="hidden peer" type="checkbox"></input>
      <label htmlFor={`room-checkbox-${index}`} className="size-full flex items-center justify-center text-xl text-center italic peer-checked:bg-olive hover:cursor-pointer hover:peer-not-checked:underline">Select</label>
    </div>
  </div>

}
