import { createContext, useContext, useState } from "react";
import type { Room } from "~/types/booking";
import { getUrlSearchParams } from "~/utils/general";
import getRoomPools from "../formComponents/utils";

const BookingRoomSelectContext = createContext<any>({})

export default function BookingRoomSelectContextProvider({ children, rooms }) {
  const params = getUrlSearchParams(["adults", "children"])
  const [selectedRooms, setSelectedRooms] = useState<Room[]>([])
  const [form, setForm] = useState()
  const [guestPool, setGuestPool] = useState({ adults: Number(params.adults), children: Number(params.children) })
  const roomPoolsDefault = getRoomPools(rooms)
  const [roomPools, setRoomPools] = useState(roomPoolsDefault)
  const [totalPrice, setTotalPrice] = useState(0)

  return <BookingRoomSelectContext value={{ form, setForm, selectedRooms, setSelectedRooms, totalPrice, setTotalPrice, guestPool, setGuestPool, roomPools, setRoomPools }}> {children}</BookingRoomSelectContext >
}

export const useBookingRoomSelectContextProvider = () => { return useContext(BookingRoomSelectContext) }
