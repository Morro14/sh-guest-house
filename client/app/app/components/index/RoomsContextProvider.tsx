import { createContext, useContext, useState } from "react";
import type { Room } from "./Rooms";

export const RoomsContext = createContext<any>({});

export default function RoomsContextProvider({ children }) {
  const [data, setData] = useState();
  const [roomSelected, setRoomSelected] = useState(0);
  const [imageSelected, setImageSelected] = useState();
  const [lastSelected, setLastSelected] = useState({ current: 0, prev: 0 })
  const values = {
    lastSelected,
    setLastSelected,
    roomSelected,
    setRoomSelected,
    imageSelected,
    setImageSelected,
    data,
    setData,
  };

  return <RoomsContext value={values}>{children}</RoomsContext>;
}

export const useRoomContextProvider = () => {
  return useContext(RoomsContext);
};
