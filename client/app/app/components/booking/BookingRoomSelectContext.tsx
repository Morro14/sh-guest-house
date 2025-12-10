import { createContext, useContext, useState } from "react";
import type { Room } from "~/types/booking";


const BookingRoomSelectContext = createContext<any>({})

export default function BookingRoomSelectContextProvider({ children }) {
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [form, setForm] = useState()
  return <BookingRoomSelectContext value={{ form, setForm, selectedRooms, setSelectedRooms }}> {children}</BookingRoomSelectContext >
}

export const useBookingRoomSelectContextProvider = () => { return useContext(BookingRoomSelectContext) }
