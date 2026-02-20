import { useTranslation } from "react-i18next";
import type { Room } from "~/types/booking.tsx";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function BookingSummaryRoom(
  room: Room,
  guests: { adults: number; children: number },
) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-10 mb-1" key={`summary-room-${room.slug}`}>
      <div className="col-span-2 mt-1 h-24 overflow-clip border-2 border-peach">
        <img
          src={BASE_URL + room.images[0].variants.small}
          className="object-cover size-full"
        />
      </div>
      <div className="col-span-8 grid grid-cols-8 pl-2">
        <div className="col-span-8 font-serif mb-1">{room.name}</div>
        <div className="col-span-2 text-sm text-gray-warm-mid">
          {t("Maximum guests")}
        </div>
        <div className="col-span-6 ">{room.adults_num + room.children_num}</div>
        <div className="col-span-2 text-sm text-gray-warm-mid">
          {t("Selected guests")}
        </div>
        <div className="col-span-3 ">
          <span className="text-sm text-gray-warm-mid">
            {t("Adults") + ": "}
          </span>
          <span>{guests.adults}</span>
        </div>
        <div className="col-span-3 ">
          <span className="text-sm text-gray-warm-mid">
            {t("Children") + ": "}
          </span>
          <span>{guests.children}</span>
        </div>
        <div className="col-span-2 text-sm text-gray-warm-mid">{t("Beds")}</div>
        <div className="col-span-6 truncate overflow-hidden text-sm text-gray-warm-mid">
          {room.beds}
        </div>
        <div className="col-span-8 h-[18px]"></div>
      </div>
    </div>
  );
}
