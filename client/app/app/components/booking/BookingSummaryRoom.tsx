import { useTranslation } from "react-i18next";
import type { Room } from "~/types/booking.tsx";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function BookingSummaryRoom(
  room: Room,
  guests: { adults: number; children: number },
) {
  const { t } = useTranslation();
  return (
    <div
      className="grid md:grid-cols-5 md:col-span-5 col-span-10 grid-cols-1 gap-y-2 pl-4"
      key={`summary-room-${room.slug}`}
    >
      <li className="col-span-5 text-sm ml-4 text-gray-warm-mid font-serif">
        {room.name}
      </li>
      <div className="col-span-5 mt-1 w-[172px] h-[98px] overflow-clip border-2 border-peach">
        <img
          src={BASE_URL + room.images[0].variants.small}
          className="object-cover size-full"
        />
      </div>
      <ul className="list-disc pl-8 pt-2 col-span-5 text-sm truncate grid grid-cols-8">
        <li className="col-span-3 text-sm text-gray-warm-mid">
          {t("Maximum guests") + ":"}
        </li>
        <div className="col-span-4 ">{room.adults_num + room.children_num}</div>
        <li className="col-span-7 text-sm text-gray-warm-mid">
          {t("Selected guests") + ":"}
        </li>
        <div className="col-span-2 ">
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
        <li className=" col-span-7 text-sm text-gray-warm-mid">
          {t("Beds") + ":"}
        </li>
        <div className="col-span-7 truncate overflow-hidden text-sm text-gray-warm-mid">
          {room.beds}
        </div>
      </ul>
    </div>
  );
}
