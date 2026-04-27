import type { Room } from "~/types/booking";
import { useNavContextProvider } from "../nav/NavContextProvider";
import { isDigit, formatPrice, getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const CURRENCY = import.meta.env.VITE_CURRENCY;

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL

export default function AvailableRoom({
  room,
  index,
}: {
  room: Room;
  index: number;
  formRef: React.RefObject<HTMLFormElement>;
}) {
  const { nights } = getUrlSearchParams(["nights", "adults", "children"]);
  const nightsNum = nights && isDigit(nights) ? Number(nights) : 1;
  const navContext = useNavContextProvider();
  const formContext = useBookingRoomSelectContextProvider();
  const { t } = useTranslation();
  const [roomGuestsAvailable, setRoomGuestsAvailable] = useState({
    adults: room.adults_num,
    children: room.children_num + room.adults_num,
  });
  const [currentGuestSelect, setCurrentGuestSelect] = useState({
    adults: 0,
    children: 0,
  });
  const getGuestsString = () => {
    if (room.children_num === 0) {
      return `${room.adults_num} ${t("guests")}`;
    } else {
      return `${room.adults_num} ${t("guests")} + ${t("childrenWithCount", { count: room.children_num })}`;
    }
  };
  const genSelectOptions = (type: "adults" | "children") => {
    const options = [];
    const guestsLeftToAccommodate = Math.min(
      formContext.guestPool[type],
      roomGuestsAvailable[type],
    );
    for (let i = 0; i < roomGuestsAvailable[type] + 1; i++) {
      options.push(
        <option
          key={`opt-${room.slug}-${type}-${i}`}
          disabled={
            i > currentGuestSelect[type] + guestsLeftToAccommodate
              ? true
              : false
          }
          value={i}
        >
          {i}
        </option>,
      );
    }
    return options;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    const priceChange = 0;

    if (e.target.name === `[${room.slug}][adults]`) {
      const guestNumberChange = value - currentGuestSelect.adults;
      // priceChange += guestNumberChange * room.price;
      setCurrentGuestSelect({ ...currentGuestSelect, adults: value });

      formContext.setGuestPool({
        ...formContext.guestPool,
        adults:
          formContext.guestPool.adults + (currentGuestSelect.adults - value),
      });
    } else if (e.target.name === `[${room.slug}][children]`) {
      const guestNumberChange = value - currentGuestSelect.children;
      // priceChange += guestNumberChange * room.price;
      setCurrentGuestSelect({ ...currentGuestSelect, children: value });
      formContext.setGuestPool({
        ...formContext.guestPool,
        children:
          formContext.guestPool.children +
          (currentGuestSelect.children - value),
      });
    }
    // formContext.setTotalPrice(formContext.totalPrice + priceChange);
  };
  const roomSelected =
    currentGuestSelect.adults !== 0 || currentGuestSelect.children !== 0;
  return (
    <fieldset key={room.name} className={`drop-shadow-sm bg-bg`}>
      <legend className="sr-only">{room.name}</legend>
      <img
        className="border-2 border-peach object-cover sm:w-[482px] w-[360px] md:h-[272px] h-[203px] hover:cursor-pointer"
        src={`${MEDIA_URL}${room.images[0].variants.small}`}
        onClick={() => {
          navContext.setFullImageView(true);
          navContext.setItemSelected(index);
        }}
      />
      <div className="flex flex-col gap-2 mt-2 px-2">
        <h4 className="mb-0!">{room.name}</h4>
        <div className="font-sans grid grid-cols-10 gap-y-2 sm:gap-y-0 text-base">
          <span className="flex font-light sm:col-span-4 col-span-10 ">
            {t("Maximum guests")}
          </span>
          <span className="font-light pl-2 sm:col-span-6 col-span-10">
            {getGuestsString()}
          </span>
          <span className="font-light flex sm:col-span-4 col-span-10">
            {t("Select number of guests")}
          </span>
          <div className="pl-2 sm:col-span-6 col-span-10  grid sm:gap-y-0 gap-y-1 grid-cols-6">
            <div className="sm:col-span-3 col-span-10 flex items-center gap-2">
              <label className="sm:w-auto w-16">{t("adults")}</label>
              <select
                name={`[${room.slug}][adults]`}
                onChange={handleChange}
                className={`${currentGuestSelect.adults > 0 ? "text-peach-dark" : "text-accent"} h-6 border-1 rounded-sm px-1`}
              >
                {genSelectOptions("adults")}
              </select>
            </div>
            <div className="sm:col-span-3 col-span-10 flex gap-2">
              <label className="sm:w-auto w-16">{t("children")}</label>
              <select
                name={`[${room.slug}][children]`}
                onChange={handleChange}
                className={`${currentGuestSelect.children > 0 ? "text-peach-dark" : "text-accent"} h-6 border-1 rounded-sm px-1`}
              >
                {genSelectOptions("children")}
              </select>
            </div>
          </div>
          <span className="flex sm:col-span-4 col-span-10 font-light">
            {t("Beds")}
          </span>
          <span className="pl-2 flex sm:col-span-6 col-span-10 font-light">
            {room.beds.slice(0, 20)}
          </span>
        </div>
        <div className="flex items-end gap-32">
          <div className="flex flex-col">
            <div className="font-sans text-base">{t("For one night")}:</div>
            <span className="font-sans text-green-warm text-xl -mt-1">{`${formatPrice(room.price, CURRENCY)}`}</span>
          </div>
          {nightsNum > 1 ? (
            <div className="flex flex-col">
              <div className="font-sans text-base font-light">{`For ${nightsNum} nights:`}</div>
              <div className="flex items-end">
                <span className="font-sans text-green-warm text-xl -mt-1">{`${formatPrice(room.price * nightsNum, CURRENCY)}`}</span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 border-y-1 border-gray-warm h-8">
        {/* <input name={`room-${index}`} value={room.slug} onChange={() => formContext.setSelectedRooms(getSelectedRooms(formRef?.current))} id={`room-checkbox-${index}`} className="absolute opacity-0 pointer-events-none peer" type="checkbox"></input> */}
        <span
          className={`size-full flex items-center justify-center font-sans font-light text-center transition-all duration-200 ${roomSelected ? "" : "text-gray-warm-inactive"}`}
        >
          {!roomSelected ? t("Select guests") : t("Room selected")}
        </span>
      </div>
    </fieldset>
  );
}
