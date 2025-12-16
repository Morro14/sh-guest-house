import { createContext, useContext, useState } from "react";
import type { Room } from "~/types/booking";
import { getUrlSearchParams } from "~/utils/general";

const BookingRoomSelectContext = createContext<any>({})

export default function BookingRoomSelectContextProvider({ children, rooms }) {
  const params = getUrlSearchParams(["adults", "children"])
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [form, setForm] = useState()
  const [totalPrice, setTotalPrice] = useState(0)

  return <BookingRoomSelectContext value={{ form, setForm, selectedRooms, setSelectedRooms, totalPrice, setTotalPrice }}> {children}</BookingRoomSelectContext >
}

export const useBookingRoomSelectContextProvider = () => { return useContext(BookingRoomSelectContext) }
