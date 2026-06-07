import type { Room } from "~/types/booking.tsx";
import { ImageLoading } from "../ImageLoading";

const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL;

export default function BookingSummaryRoom(room: Room) {
  return (
    <div
      className="flex flex-col gap-2 font-sans w-[336px] p-2 drop-shadow-lg bg-bg"
      key={`summary-room-${room.slug}`}
    >
      <div className="w-[172px] h-[98px] overflow-clip border-2 border-peach">
        <ImageLoading
          imageAttrs={{
            src: `${MEDIA_BASE_URL}${room?.images[0]?.variants?.small}`,
            className: "object-cover size-full",
          }}
        ></ImageLoading>
      </div>
      <span className="text text-text-main">{room.name}</span>
      <span className="text-sm h-[18px] truncate">{room.description}</span>
      <span className="text-sm truncate max-h-12">{room.beds}</span>
      <div className="text-sm truncate grid"></div>
    </div>
  );
}
