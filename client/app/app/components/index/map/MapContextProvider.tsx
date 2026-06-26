import { createContext, useContext, useState } from "react";
import type { MapPlaceData } from "~/types/map";
import messagesModal from "./modalMessages/mapMessages.json";

export const MapContext = createContext(null);

export default function MapContextProvider({ children }) {
  const [fullView, setFullView] = useState(false);
  const [placeSelected, setPlaceSelected] = useState<MapPlaceData>(null);
  const [zoom, setZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState<null | { x: number; y: number }>(
    null,
  );
  const [mapElements, setMapElements] = useState<any>({});

  const [modalMessagesToShow, setModalMessagesToShow] = useState(messagesModal);
  function removeMessage(name: string) {
    const indexToRemove = modalMessagesToShow.findIndex(
      (msg) => msg.name === name,
    );
    const newMessages = modalMessagesToShow.toSpliced(indexToRemove, 1);
    setModalMessagesToShow(newMessages);
  }
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

        mapElements,
        setMapElements,

        modalMessagesToShow,
        removeMessage,
      }}
    >
      {children}
    </MapContext>
  );
}

export const useMapContextProvider = () => {
  return useContext(MapContext);
};
