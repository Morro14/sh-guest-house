import { getUrlSearchParams } from "~/utils/general"
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext"
import type { Room } from "~/types/booking"
import { requireMoreRooms } from "../formComponents/utils"

export default function FloatingPannel(rooms: Room[]) {
  const params = getUrlSearchParams(["date", "adults", "children", "days"])
  const guests = Number(params.adults) + Number(params.children)
  const formContext = useBookingRoomSelectContextProvider()
  const moreRoomsRequired = requireMoreRooms(formContext.selectedRooms, guests)
  return <div className="sticky z-30 top-0 w-full flex justify-center items-start h-14">
    <div className={`absolute transition-all duration-500 2xl:w-[1100px] ${moreRoomsRequired ? "h-14" : "h-8"} drop-shadow-md bg-gray-50`}></div>
    <div className={`flex flex-col items-center justify-center 2xl:w-[1100px]`}>
      <div className="z-20 flex justify-between items-start w-full">
        <div className="w-[94px] pl-4"></div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-7 font-sans">
            <div>{`Date: ${params.date}`}</div>
            <div>{`Guests: ${guests}`}</div>
            <div>{`Nights: ${params.days}`}</div>
          </div>
          <div className={`text-red-error font-sans ${moreRoomsRequired ? "block" : "hidden opacity-0"} transition-discrete transition-all duration-500`}>{`Select more rooms to accommodate ${guests} guests`}</div>
        </div>
        <div className="flex items-center gap-2 pr-4">
          <button onClick={() => formContext.form.submit()}>Book</button>
          {bookingArrow}
        </div>
      </div>
    </div>
  </div>
}


const bookingArrow = <svg width="33" height="9" viewBox="0 0 33 9" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M-1.66893e-06 4.5C19.8 4.5 29.5833 4.5 32 4.5" stroke="#4C3B33" />
  <path d="M25 8.5C27.5104 5.54346 29.908 4.5 32 4.5" stroke="#4C3B33" stroke-linecap="round" />
  <path d="M25 0.5C27.5104 3.45654 29.908 4.5 32 4.5" stroke="#4C3B33" stroke-linecap="round" />
</svg> 
