import { createContext, useContext, useState } from "react";

export const NavContext = createContext(null);

export default function NavContextProvider({ children }) {
  const [data, setData] = useState();
  // image
  const [fullImageView, setFullImageView] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [dots, setDots] = useState([]);
  // nav item
  const [itemSelected, setItemSelected] = useState(0);
  const [lastItemSelected, setLastItemSelected] = useState(0);
  const [selectorPos, setSelectorPos] = useState(0);

  const preStateChangeCallback = (callback: () => void) => callback();
  const values = {
    itemSelected,
    setItemSelected,
    fullImageView,
    setFullImageView,
    lastItemSelected,
    setLastItemSelected,
    selectorPos,
    setSelectorPos,
    data,
    setData,
    preStateChangeCallback,
    dots,
    setDots,
    imageSelected,
    setImageSelected,
  };

  return <NavContext value={values}>{children}</NavContext>;
}

export const useNavContextProvider = () => {
  return useContext(NavContext);
};
