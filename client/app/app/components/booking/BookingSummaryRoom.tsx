import { useTranslation } from "react-i18next";
import type { Room } from "~/types/booking.tsx";

const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL

export default function BookingSummaryRoom(
  room: Room,
  guests: { adults: number; children: number },
) {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col gap-2"
      key={`summary-room-${room.slug}`}
    >
      <li className="text-lg ml-4 mt-3 text-text-main font-serif">
        {room.name}
      </li>
      <div className="w-[172px] h-[98px] overflow-clip border-2 border-peach">
        <img
          src={`${MEDIA_BASE_URL}${room.images[0].variants.small}`}
          className="object-cover size-full"
        />
      </div>
      <ul className="list-disc pt-2 text-sm truncate grid">
        <li className="text-sm">
          {`${t("Maximum guests")} : ${room.adults_num + room.children_num}`}
        </li>
        <li className="text-sm ">
          {`${t("Selected guests")}: ${t("adults")} `}<b>{guests.adults}</b>{` ${t("children")} `}<b>{guests.children}</b>
        </li>
        <li className="text-sm text-wrap max-w-48 max-h-12">
          {`${t("Beds")}: ${room.beds}`}
        </li>
      </ul>
    </div>
  );
}
