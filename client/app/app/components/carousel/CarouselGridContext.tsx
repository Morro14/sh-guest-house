import {
  useState,
  createContext,
  useContext,
  type SetStateAction,
} from "react";
import type { GridImage } from "./ImageGrid";

interface Context {
  fullView: false | GridImage;
  setFullView: React.Dispatch<SetStateAction<false | GridImage>>;

  showMoreImages: boolean;
  setShowMoreImages: React.Dispatch<SetStateAction<boolean>>;
}

const CarouselGridContext = createContext<Context | null>(null);

export default function CarouselGridContextProvider({ children }) {
  const [showMoreImages, setShowMoreImages] = useState(false);
  const [fullView, setFullView] = useState<false | GridImage>(false);
  return (
    <CarouselGridContext
      value={{
        showMoreImages,
        setShowMoreImages,

        fullView,
        setFullView,
      }}
    >
      {children}
    </CarouselGridContext>
  );
}

export const useCarouselGridContextProvider = () => {
  return useContext(CarouselGridContext);
};
