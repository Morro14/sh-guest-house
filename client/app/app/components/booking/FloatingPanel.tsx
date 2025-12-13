import { getUrlSearchParams } from "~/utils/general"
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext"
import type { Room } from "~/types/booking"
import { requireMoreRooms } from "../formComponents/utils"
import { useEffect, useRef, useState } from "react"
import FlotaingPanelBlock from "../FloatingPanelBlock"

export default function FloatingPanel({ rooms }: { rooms: Room[] }) {
  const params = getUrlSearchParams(["date", "adults", "children", "days"])
  const guests = Number(params.adults) + Number(params.children)
  const formContext = useBookingRoomSelectContextProvider()
  const moreRoomsRequired = requireMoreRooms(formContext.selectedRooms, rooms, guests)
  const [requestInfoShow, setRequestInfoShow] = useState(false)
  const [panelOffScreen, setPanelOffScreen] = useState(false)

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (!entry.isIntersecting) {
        setRequestInfoShow(true)
        setPanelOffScreen(true)
      } else {
        setRequestInfoShow(false)
        setPanelOffScreen(false)
      }
    }, { root: null, threshold: 0 })
    intersectionObserver.observe(document.getElementById("request-info-block"))
  }, [])

  return <div className={`${panelOffScreen ? "fixed top-4" : "absolute mt-4"} z-20 top-0 w-full flex flex-col items-center justify-center transition-all duration-200`}>
    <div className={`absolute transition-all duration-200 2xl:w-[1100px] ${moreRoomsRequired ? "h-14" : "h-10"} bg-bg drop-shadow-md`}></div>
    <div className="z-10 flex justify-between items-start w-[1100px]">
      <div className="w-[94px] pl-4"></div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-7 font-sans overflow-hidden transition-all duration-200`}>
            <div>{`Date: ${params.date}`}</div>
            <div>{`Guests: ${guests}`}</div>
            <div>{`Nights: ${params.days}`}</div>
          </div>
        </div>
        <div className={`z-10 text-red-error font-sans ${moreRoomsRequired ? "block" : "hidden opacity-0"} transition-discrete transition-all duration-200`}>{`Select more rooms to accommodate ${guests} guests`}</div>
      </div>
      <div className={`flex items-center gap-2 px-4 h-full transition-colors duration-200 font-medium ${moreRoomsRequired ? 'stroke-gray-warm-inactive text-gray-warm-inactive' : 'stroke-text-main text-text-main underline'} `}>
        <button onClick={() => formContext.form.submit()}>Book</button>
        {bookingArrow}
      </div>
    </div>
  </div>
}


const bookingArrow = <svg width="33" height="9" viewBox="0 0 33 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-1">
  <path d="M-1.66893e-06 4.5C19.8 4.5 29.5833 4.5 32 4.5" />
  <path d="M25 8.5C27.5104 5.54346 29.908 4.5 32 4.5" stroke-linecap="round" />
  <path d="M25 0.5C27.5104 3.45654 29.908 4.5 32 4.5" stroke-linecap="round" />
</svg> 
