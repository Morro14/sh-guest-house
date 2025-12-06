import { createContext, useContext, useState } from "react";

export const NavContext = createContext<any>({});

export default function NavContextProvider({ children }) {
  const [data, setData] = useState();
  const [fullImageView, setFullImageView] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const [itemSelected, setItemSelected] = useState(0);
  const [selectorPos, setSelectorPos] = useState(0);
  const [dots, setDots] = useState([]);
  const [lastSelected, setLastSelected] = useState(0)
  const preStateChangeCallback = () => { }
  const values = {
    itemSelected, setItemSelected,
    fullImageView, setFullImageView,
    lastSelected, setLastSelected,
    selectorPos, setSelectorPos,
    data, setData,
    preStateChangeCallback,
    dots, setDots,
    imageSelected, setImageSelected

  };

  return <NavContext value={values}>{children}</NavContext>;
}

export const useNavContextProvider = () => {
  return useContext(NavContext);
};

