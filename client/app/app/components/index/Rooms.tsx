import { useFetchV3 } from "~/utils/fetchHook";
import { useNavContextProvider } from "../nav/NavContextProvider";
import MediaFullView from "../MediaFullView";
import { Carousel } from "../carousel/Carousel";
import type { Room } from "app/types/booking";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { axiosInstance } from "~/utils/general";
import { logError } from "~/utils/logging";

const debug = import.meta.env.VITE_DEBUG === "true";
const MEDIA_BASE_URL = debug ? import.meta.env.VITE_LOCAL_SERVER_URL : "";

export default function RoomsPreview() {
  const { fetchedData, loading } = useFetchV3("content/rooms/?limit=3");
  const { t } = useTranslation();
  const rooms = fetchedData?.data?.data.results as Array<Room>;
  const context = useNavContextProvider();
  const roomCardAngles = ["-rotate-1", "rotate-2", "rotate-1", "-rotate-2"];
  const roomCardOffsets = { leftOffset: "left-11", rightColumn: "top-12" };
  const [showMoreRooms, setShowMoreRooms] = useState(false);
  const [expandContainer, setExpandContainer] = useState(false);
  const [roomCardOpacity, setRoomCardOpacity] = useState("opacity-0");
  const [extraRooms, setExtraRooms] = useState<Array<Room> | null>(null);
  function genRoomCard(room: Room, i: number) {
    const styles = [];
    if (i % 2 !== 0) {
      styles.push(roomCardOffsets.rightColumn);
    }
    if ((i + 1) % 3 === 0) {
      styles.push(roomCardOffsets.leftOffset);
    }
    styles.push(roomCardAngles[i % roomCardAngles.length]);
    if (i > 2) {
      styles.push(roomCardOpacity);
    }
    const styleString = styles.join(" ");
    return (
      <div
        className={`relative flex flex-col items-center overflow-hidden ${styleString} top-0 transition-opacity duration-300`}
        key={`room-card-${i}`}
      >
        <img
          className="object-cover md:w-100.5 md:h-57 border-2 border-primary cursor-pointer drop-shadow-sm"
          src={`${MEDIA_BASE_URL}${room.images[0].variants.small}`}
          onClick={() => {
            context.setItemSelected(i);
            context.setFullImageView(true);
          }}
        />
        <span className="text-lg font-medium">{room.name}</span>
      </div>
    );
  }
  useEffect(() => {
    if (expandContainer) {
      setRoomCardOpacity("opacity-100");
    } else if (!expandContainer) {
      setRoomCardOpacity("opacity-0");
    }
  }, [expandContainer]);

  useEffect(() => {
    if (!showMoreRooms || extraRooms) return;
    axiosInstance
      .get("content/rooms/?limit=10&offset=3")
      .then((response) => {
        if (response.status === 200) {
          setExtraRooms(response.data.data.results);
        }
      })
      .catch((r) => logError(r));
  }, [showMoreRooms, extraRooms]);

  console.log("extra rooms", extraRooms);
  return !rooms || loading ? (
    <div className="flex justify-center items-center text-center w-full h-96 bg-gray-warm-light text-gray-500 font-sans rounded-xl">
      <span>
        {!rooms || rooms.length === 0 ? t("No data") : t("Loading...")}
      </span>
    </div>
  ) : (
    <div
      className={`flex flex-col md:items-center 2xl:items-start w-full ${expandContainer ? "2xl:h-420" : "2xl:h-144"} 2xl:justify-between relative transition-[height] duration-300`}
    >
      {context.fullImageView ? (
        <MediaFullView>
          <Carousel
            name="rooms"
            key={`room-carousel-${rooms[context.itemSelected].slug}`}
            images={rooms[context.itemSelected].images}
            imageSize="full"
            imageRes="original"
            fullView={true}
          ></Carousel>
        </MediaFullView>
      ) : (
        ""
      )}
      <div
        className={`grid grid-cols-2 gap-4 gap-y-16 relative 2xl:px-28 w-full content-start transition-none duration-0`}
      >
        {rooms.map((room, i) => genRoomCard(room, i))}
        {showMoreRooms && extraRooms
          ? rooms.concat(extraRooms).map((room, i) => {
              if (i < 3) return "";
              return genRoomCard(room, i);
            })
          : ""}
        <button
          className="font-medium underline cursor-pointer"
          onClick={() => {
            flushSync(() => {
              setExpandContainer(!expandContainer);
              if (!showMoreRooms) setShowMoreRooms(true);
            });
            if (showMoreRooms) {
              setTimeout(() => {
                setShowMoreRooms(!showMoreRooms);
              }, 300);
              return;
            }
          }}
        >
          {!showMoreRooms ? t("More rooms...") : t("Show less rooms")}
        </button>
      </div>
    </div>
  );
}
