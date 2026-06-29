import {
  useState,
  createContext,
  useContext,
  type SetStateAction,
} from "react";
import type { GridImage } from "~/types/grid";

interface Context {
  fullView: false | GridImage;
  setFullView: React.Dispatch<SetStateAction<false | GridImage>>;

  showMoreImages: boolean;
  setShowMoreImages: React.Dispatch<SetStateAction<boolean>>;

  sideGridsVisible: boolean;
  setSideGridsVisible: React.Dispatch<SetStateAction<boolean>>;

  sideGridsDelayedShow: boolean;
  setSideGridsDelayedShow: React.Dispatch<SetStateAction<boolean>>;
}

const CarouselGridContext = createContext<Context | null>(null);

export default function CarouselGridContextProvider({ children }) {
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [fullView, setFullView] = useState<false | GridImage>(false);
  const [sideGridsDelayedShow, setSideGridsDelayedShow] = useState(false);
  const [sideGridsVisible, setSideGridsVisible] = useState(false);
  return (
    <CarouselGridContext
      value={{
        showMoreImages,
        setShowMoreImages,

        fullView,
        setFullView,

        sideGridsVisible,
        setSideGridsVisible,

        sideGridsDelayedShow,
        setSideGridsDelayedShow,
      }}
    >
      {children}
    </CarouselGridContext>
  );
}

export const useCarouselGridContextProvider = () => {
  return useContext(CarouselGridContext);
};
