import type { Room } from "~/types/booking"
import { useNavContextProvider } from "../nav/NavContextProvider"
import { isDigit, formatPrice, getUrlSearchParams } from "~/utils/general"
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext"
import { getSelectedRooms } from "../formComponents/utils"
import { useTranslation } from "react-i18next"
import { useState } from "react"


const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function AvailableRoom({ room, index, formRef }: { room: Room, index: number, formRef: React.RefObject<HTMLFormElement> }) {
  const { days } = getUrlSearchParams(["days", "adults", "children"])
  const daysNum = days && isDigit(days) ? Number(days) : 1
  const navContext = useNavContextProvider()
  const formContext = useBookingRoomSelectContextProvider()
  const { t } = useTranslation()
  const [roomGuestsAvailable, setRoomGuestsAvailable] = useState({ adults: room.adults_num, children: room.children_num + room.adults_num })
  const [currentGuestSelect, setCurrentGuestSelect] = useState({ adults: 0, children: 0 })
  const getGuestsString = () => {
    if (room.children_num === 0) {
      return `${room.adults_num} ${t('guests')}`
    } else {
      return `${room.adults_num} ${t('guests')} + ${t('childrenWithCount', { count: room.children_num })}`
    }
  }
  const genSelectOptions = (type: 'adults' | 'children') => {
    let options = []
    const guestsLeftToAccommodate = Math.min(formContext.guestPool[type], roomGuestsAvailable[type])
    if (index === 0) {
      console.log('currentGuestSelect', currentGuestSelect, 'left to accommodate', type, guestsLeftToAccommodate)
    }
    for (let i = 0; i < roomGuestsAvailable[type] + 1; i++) {
      options.push(<option key={`opt-${room.slug}-${type}-${i}`} disabled={i > (currentGuestSelect[type] + guestsLeftToAccommodate) ? true : false} value={i}>{i}</option>)
    }
    return options
  }
  if (index === 0) {
    console.log('guestPool before change', formContext.guestPool)
  }

  const handleChange = (e) => {
    const value = e.target.value
    if (e.target.name === 'adults-select') {
      setCurrentGuestSelect({ ...currentGuestSelect, adults: Number(value) })
      formContext.setGuestPool({ ...formContext.guestPool, adults: formContext.guestPool.adults + (currentGuestSelect.adults - value) })
    } else if (e.target.name === 'children-select') {
      setCurrentGuestSelect({ ...currentGuestSelect, children: Number(value) })
      formContext.setGuestPool({ ...formContext.guestPool, children: formContext.guestPool.children + (currentGuestSelect.children - value) })
    }
  }
  return <div key={room.name}>
    <img className="border-2 border-peach object-cover w-[482px] h-[272px]" src={`${SERVER_URL}/${room.images[0].variants.small}`} onClick={() => { navContext.setFullImageView(true); navContext.setItemSelected(index) }} />
    <div className="flex flex-col gap-2 mt-2">
      <h4>{room.name}</h4>
      <div className="font-sans grid grid-cols-10 text-base">
        <span className="flex font-[350] col-span-4 ">{t('Maximum guests')}</span>
        <span className="pl-2 col-span-6">{getGuestsString()}</span>
        <span className="flex col-span-4 font-[350]">{t('Select number of guests')}</span>
        <div className="pl-2 col-span-6 grid grid-cols-6">
          <div className="col-span-2 flex gap-2">
            <label>{t('adults')}</label>
            <select name="adults-select" onChange={handleChange}>
              {
                genSelectOptions('adults')
              }
            </select>
          </div>
          <div className="col-span-2 flex gap-2">
            <label>{t('children')}</label>
            <select name="children-select" onChange={handleChange}>
              {
                genSelectOptions('children')
              }
            </select>
          </div>
        </div>
        <span className="flex col-span-4 font-[350]">{t('Beds')}</span>
        <span className="pl-2 flex col-span-6">{room.beds.slice(0, 20)}</span>
      </div>
      <div className="flex items-end gap-32">
        <div className="flex flex-col">
          <div className="font-sans text-base font-light">{t('For one night')}:</div>
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
      <input name={`room-${index}`} value={room.slug} onChange={() => formContext.setSelectedRooms(getSelectedRooms(formRef?.current))} id={`room-checkbox-${index}`} className="absolute opacity-0 pointer-events-none peer" type="checkbox"></input>
      <label htmlFor={`room-checkbox-${index}`} className="size-full flex items-center justify-center text-xl text-center italic peer-checked:bg-peach-light hover:cursor-pointer hover:peer-not-checked:underline">{t('Select')}</label>
    </div>
  </div>

}
