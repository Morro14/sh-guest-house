import { useNavContextProvider } from "../nav/NavContextProvider";
import MediaFullView from "../MediaFullView";
import { Carousel } from "../carousel/Carousel";
import type { Room } from "app/types/booking";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAxiosInstance } from "~/utils/general";
import { logError } from "~/utils/logging";

const debug = import.meta.env.VITE_DEBUG === "true";
const MEDIA_BASE_URL = debug ? import.meta.env.VITE_LOCAL_SERVER_URL : "";
const ROOMS_NUMBER_SHOW_INIT = 1;
const ROOMS_NUMBER_SHOW_EXRA = 10;

export default function RoomsPreview() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState(null);
  const [roomCards, setRoomCards] = useState<React.ReactNode | null>(null);
  const context = useNavContextProvider();
  const [showMoreRooms, setShowMoreRooms] = useState(false);
  const [expandContainer, setExpandContainer] = useState(false);
  const [extraRooms, setExtraRooms] = useState<Array<Room> | []>([]);

  useEffect(() => {
    if (rooms) return;
    const axiosInstance = getAxiosInstance();
    axiosInstance
      .get(`content/rooms/?limit=${ROOMS_NUMBER_SHOW_INIT}`)
      .then((response) => {
        if (response.status === 200) {
          const rooms = response.data.data.results as Room[];
          setRooms(rooms);
          const roomCards = rooms.map((room, i) => genRoomCard(room, i));
          setRoomCards(roomCards);
        }
      })
      .catch((r) => logError(r));
  }, [rooms]);

  function genRoomCard(room: Room, i: number) {
    return (
      <div
        className={`flex w-full md:h-67 h-34 flex-col items-center transition-all duration-300 starting:opacity-0 opacity-100`}
        key={`room-card-${i}`}
      >
        <img
          className="object-cover border-2 md:h-57 h-29 w-full border-primary cursor-pointer drop-shadow-sm"
          src={`${MEDIA_BASE_URL}${room.images[0].variants.small}`}
          onClick={() => {
            context.setItemSelected(i);
            context.setFullImageView(true);
          }}
        />
        <span className="md:text-lg text-sm font-medium">{room.name}</span>
      </div>
    );
  }

  useEffect(() => {
    if (!showMoreRooms || extraRooms.length > 0) return;
    const axiosInstance = getAxiosInstance();
    axiosInstance
      .get(
        `content/rooms/?limit=${ROOMS_NUMBER_SHOW_EXRA}&offset=${ROOMS_NUMBER_SHOW_INIT}`,
      )
      .then((response) => {
        if (response.status === 200) {
          setExtraRooms(response.data.data.results);
        }
      })
      .catch((r) => logError(r));
  }, [showMoreRooms, extraRooms]);
  let extraRoomsEl = null;
  if (extraRooms.length > 0) {
    extraRoomsEl = extraRooms.map((room, i) => {
      return genRoomCard(room, i + ROOMS_NUMBER_SHOW_INIT);
    });
  }
  return !rooms ? (
    <div className="flex justify-center items-center text-center w-full h-96 bg-gray-warm-light text-gray-500 font-sans rounded-xl">
      <span>
        {!rooms || rooms.length === 0 ? t("No data") : t("Loading...")}
      </span>
    </div>
  ) : (
    <div
      className={`flex justify-center w-full ${showMoreRooms ? `2xl:h-290 md:h-290 h-150` : "md:h-[270px] h-34"} relative transition-[height] duration-300`}
    >
      {context.fullImageView ? (
        <MediaFullView>
          <Carousel
            name="rooms"
            key={`room-carousel-${[...rooms, ...extraRooms][context.itemSelected].slug}`}
            images={[...rooms, ...extraRooms][context.itemSelected].images}
            imageSize="full"
            imageRes="original"
            fullView={true}
          ></Carousel>
        </MediaFullView>
      ) : (
        ""
      )}
      <div
        className={`grid gap-4 2xl:w-3/5 w-full grid-cols-2 transition-none duration-0`}
      >
        {roomCards
          ? roomCards.map((room, i) => {
              return room;
            })
          : ""}
        {showMoreRooms && extraRoomsEl ? extraRoomsEl : ""}
        <button
          className="font-medium underline cursor-pointer"
          onClick={() => {
            setExpandContainer(!expandContainer);
            setShowMoreRooms(!showMoreRooms);
          }}
        >
          {!showMoreRooms ? t("More rooms...") : t("Show less rooms")}
        </button>
      </div>
    </div>
  );
}
