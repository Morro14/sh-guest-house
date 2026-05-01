import { createContext, useContext, useState } from "react";
import type { MapPlaceData } from "~/types/map";

export const MapContext = createContext(null);

export default function MapContextProvider({ children }) {
  const [fullView, setFullView] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<MapPlaceData>(null);
  const [zoom, setZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState<null | { x: number; y: number }>(
    null,
  );
  return (
    <MapContext
      value={{
        fullView,
        setFullView,
        placeSelected,
        setPlaceSelected,
        zoom,
        setZoom,
        mapOffset,
        setMapOffset,
      }}
    >
      {children}
    </MapContext>
  );
}

export const useMapContextProvider = () => {
  return useContext(MapContext);
};
