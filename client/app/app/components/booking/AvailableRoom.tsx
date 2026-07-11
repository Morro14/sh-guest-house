import type { Room } from "~/types/booking";
import { useNavContextProvider } from "../nav/NavContextProvider";
import { isDigit, formatPrice, getUrlSearchParams } from "~/utils/general";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ImageLoading } from "../ImageLoading";

const CURRENCY = import.meta.env.VITE_CURRENCY;

const MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL;

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
  const roomGuestsAvailable = {
    adults: room.adults_num,
    children: room.children_num + room.adults_num,
  };
  const [currentGuestSelect, setCurrentGuestSelect] = useState({
    adults: 0,
    children: 0,
  });
  // const getGuestsString = () => {
  //   if (room.children_num === 0) {
  //     return `${room.adults_num} ${t("guests")}`;
  //   } else {
  //     return `${room.adults_num} ${t("guests")} + ${t("childrenWithCount", { count: room.children_num })}`;
  //   }
  // };
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

    if (e.target.name === `[${room.slug}][adults]`) {
      setCurrentGuestSelect({ ...currentGuestSelect, adults: value });

      formContext.setGuestPool({
        ...formContext.guestPool,
        adults:
          formContext.guestPool.adults + (currentGuestSelect.adults - value),
      });
    } else if (e.target.name === `[${room.slug}][children]`) {
      setCurrentGuestSelect({ ...currentGuestSelect, children: value });
      formContext.setGuestPool({
        ...formContext.guestPool,
        children:
          formContext.guestPool.children +
          (currentGuestSelect.children - value),
      });
    }
  };
  const roomSelected =
    currentGuestSelect.adults !== 0 || currentGuestSelect.children !== 0;
  return (
    <fieldset
      key={room.name}
      className={`drop-shadow-sm bg-bg flex flex-col items-center w-[352px] md:w-[330px] pb-3  ${roomSelected ? "outline-2 outline-primary-light drop-shadow-none" : ""}`}
    >
      <legend className="sr-only">{room.name}</legend>
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="w-[336px] md:w-[314px] h-[190px] mt-2">
            <ImageLoading
              imageAttrs={{
                className:
                  "border-2 border-primary-light object-cover hover:cursor-pointer size-full",
                src: `${MEDIA_URL}${room?.images[0]?.variants?.small}`,
                onClick: () => {
                  navContext.setFullImageView(true);
                  navContext.setItemSelected(index);
                },
              }}
            ></ImageLoading>
          </div>
          <div className="px-2 mt-2">
            <h4 className="mb-0! font-serif font-medium w-full">{room.name}</h4>
            <p className="font-sans text-sm">{room.description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-3 px-2 w-full">
          <div className="flex flex-col justify-between font-sans gap-3 h-full w-full">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-warm-mid">{t("Beds")}</span>
                <span className="">{room.beds}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-warning">
                  {t("Select number of guests")}
                </span>
                <div className="flex gap-4">
                  <div className="space-x-2">
                    <label className="">{t("adults")}</label>
                    <select
                      name={`[${room.slug}][adults]`}
                      onChange={handleChange}
                      className={`${currentGuestSelect.adults > 0 ? "text-accent" : "text-text-main"} h-6 border-b px-1`}
                    >
                      {genSelectOptions("adults")}
                    </select>
                  </div>
                  <div className="space-x-2">
                    <label className="">{t("children")}</label>
                    <select
                      name={`[${room.slug}][children]`}
                      onChange={handleChange}
                      className={`${currentGuestSelect.children > 0 ? "text-accent" : "text-text-main"} h-6 border-b px-1`}
                    >
                      {genSelectOptions("children")}
                    </select>
                  </div>
                </div>
              </div>
              <div
                className={`${nightsNum > 1 ? "grid grid-cols-2" : "flex justify-between"}`}
              >
                <div className="flex flex-col col-span-2">
                  <div className="font-sans text-sm text-gray-warm-mid">
                    {t("For {{count}} night", { count: 1 })}
                  </div>
                  <span className="font-sans text-xl">
                    {formatPrice(room.price, CURRENCY)}
                  </span>
                </div>
                {nightsNum > 1 ? (
                  <div className="flex flex-col">
                    <div className="font-sans text-sm text-gray-warm-mid">
                      {t(`For {{count}} night`, { count: nightsNum })}
                    </div>
                    <div className="flex items-end">
                      <span className="font-sans text-xl">{`${formatPrice(room.price * nightsNum, CURRENCY)}`}</span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <span
                  className={` ${roomSelected ? "block" : "hidden"} text-lg text-primary text-end flex items-end justify-end`}
                >
                  {!roomSelected ? "" : t("Selected")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  );
}
