import { useNavContextProvider } from "../nav/NavContextProvider";
import MediaFullView from "../MediaFullView";
import { Carousel } from "../carousel/Carousel";
import type { Room } from "app/types/booking";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAxiosInstance } from "~/utils/general";
import { logError } from "~/utils/logging";
import Placeholder from "../Placeholder";

const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;
const ROOMS_NUMBER_SHOW_INIT = 1;
const ROOMS_NUMBER_SHOW_EXRA = 10;

export default function RoomsPreview() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState(null);
  const [roomCards, setRoomCards] = useState<React.ReactNode[] | null>(null);
  const context = useNavContextProvider();
  const [showMoreRooms, setShowMoreRooms] = useState(false);
  const [expandContainer, setExpandContainer] = useState(false);
  const [extraRooms, setExtraRooms] = useState<Array<Room> | null>(null);
  const [loadingExtraRooms, setLoadingExtraRooms] = useState(false);

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
        className={`flex w-full md:h-60 h-34 flex-col items-center transition-all duration-300 starting:opacity-0 opacity-100`}
        key={`room-card-${i}`}
      >
        <img
          className="room-card object-cover border-2 size-full border-primary cursor-pointer drop-shadow-sm"
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
    if (!showMoreRooms || extraRooms) return;
    setLoadingExtraRooms(true);
    new Promise(() => setTimeout(() => {}, 3000));
    const axiosInstance = getAxiosInstance();
    axiosInstance
      .get(
        `content/rooms/?limit=${ROOMS_NUMBER_SHOW_EXRA}&offset=${ROOMS_NUMBER_SHOW_INIT}`,
      )
      .then((response) => {
        setLoadingExtraRooms(false);
        if (response.status === 200) {
          setExtraRooms(response.data.data.results);
        }
      })
      .catch((r) => logError(r));
  }, [showMoreRooms, extraRooms]);
  let extraRoomsCards = useMemo(() => {
    if (!extraRooms) {
      return;
    }
    return extraRooms.map((room: Room, i: number) => {
      return genRoomCard(room, i + ROOMS_NUMBER_SHOW_INIT);
    });
  }, [extraRooms]);
  const getContainerHeight = (
    showMoreRooms: boolean,
    extraRooms: number = 0,
  ) => {
    const roomCardEl = document.getElementsByClassName("room-card")[0];
    if (!roomCardEl) {
      return "auto";
    }
    const labelHeight = 28;
    const rowHeight = roomCardEl.clientHeight;
    if (!showMoreRooms) {
      return rowHeight + labelHeight;
    }
    const gap = 16;
    const rows = Math.ceil(extraRooms + 1);
    const containerHeight =
      rows * rowHeight + gap * (rows - 1) + labelHeight * rows;
    return containerHeight;
  };
  return !rooms ? (
    <Placeholder
      text={!rooms || rooms.length === 0 ? t("No data") : t("Loading...")}
    ></Placeholder>
  ) : (
    <div
      className={`flex justify-center w-full relative transition-[height] duration-300`}
      style={{
        height: getContainerHeight(
          showMoreRooms,
          extraRooms ? extraRooms.length : 0,
        ),
      }}
    >
      {context.fullImageView ? (
        <MediaFullView>
          <Carousel
            name="rooms"
            key={`room-carousel-${extraRooms ? [...rooms, ...extraRooms][context.itemSelected].slug : rooms[context.itemSelected].slug}`}
            images={
              extraRooms
                ? [...rooms, ...extraRooms][context.itemSelected].images
                : rooms[context.itemSelected].images
            }
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
          ? roomCards.map((room) => {
              return room;
            })
          : ""}
        {showMoreRooms && extraRooms ? extraRoomsCards : ""}
        <div className="flex items-center justify-center">
          <button
            className="font-medium underline cursor-pointer"
            onClick={() => {
              setExpandContainer(!expandContainer);
              setShowMoreRooms(!showMoreRooms);
            }}
          >
            {loadingExtraRooms
              ? t("Loading...")
              : !showMoreRooms
                ? t("More rooms...")
                : t("Show less rooms")}
          </button>
        </div>
      </div>
    </div>
  );
}
