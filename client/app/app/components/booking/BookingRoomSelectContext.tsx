import { createContext, useContext, useState } from "react";
import { getUrlSearchParams } from "~/utils/general";

const BookingRoomSelectContext = createContext<any>({});

export default function BookingRoomSelectContextProvider({
  children,
  priceFetcher,
}) {
  const params = getUrlSearchParams(["adults", "children"]);
  const [form, setForm] = useState();
  const [roomsFormFetcher, setRoomsFormFetcher] = useState();
  const [guestPool, setGuestPool] = useState({
    adults: Number(params.adults),
    children: Number(params.children),
  });
  const moreRoomsRequired = guestPool.adults !== 0 || guestPool.children !== 0;
  const [totalPrice, setTotalPrice] = useState<number | undefined>(0);

  return (
    <BookingRoomSelectContext
      value={{
        form,
        setForm,
        totalPrice,
        setTotalPrice,
        guestPool,
        setGuestPool,
        priceFetcher,
        roomsFormFetcher,
        setRoomsFormFetcher,
        moreRoomsRequired,
      }}
    >
      {children}
    </BookingRoomSelectContext>
  );
}

export const useBookingRoomSelectContextProvider = () => {
  return useContext(BookingRoomSelectContext);
};
