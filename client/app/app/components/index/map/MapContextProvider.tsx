import { createContext, useContext, useState } from "react";
import type { MapPlaceData } from "~/types/map";

export const MapContext = createContext(null);

export default function MapContextProvider({ children }) {
  const [fullView, setFullView] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<MapPlaceData>(null);
  return (
    <MapContext
      value={{ fullView, setFullView, placeSelected, setPlaceSelected }}
    >
      {children}
    </MapContext>
  );
}

export const useMapContextProvider = () => {
  return useContext(MapContext);
};
