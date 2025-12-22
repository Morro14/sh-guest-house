import { createContext, useContext, useState } from "react";
import { getUrlSearchParams } from "~/utils/general";

const BookingRoomSelectContext = createContext<any>({})

export default function BookingRoomSelectContextProvider({ children, rooms }) {
  const params = getUrlSearchParams(["adults", "children"])
  const [form, setForm] = useState()
  const [guestPool, setGuestPool] = useState({ adults: Number(params.adults), children: Number(params.children) })
  const [totalPrice, setTotalPrice] = useState(0)

  return <BookingRoomSelectContext value={{ form, setForm, totalPrice, setTotalPrice, guestPool, setGuestPool }}> {children}</BookingRoomSelectContext >
}

export const useBookingRoomSelectContextProvider = () => { return useContext(BookingRoomSelectContext) }
