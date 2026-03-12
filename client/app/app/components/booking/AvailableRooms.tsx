import MediaFullView from "../MediaFullView";
import AvailableRoom from "./AvailableRoom";
import type { Room } from "~/types/booking";
import { Carousel } from "../carousel/Carousel";
import { useNavContextProvider } from "../nav/NavContextProvider";
import { Form, useFetcher, useLocation, useSearchParams } from "react-router";
import { useEffect, useRef, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useBookingRoomSelectContextProvider } from "./BookingRoomSelectContext";
import Fallback from "../Fallback";

export default function AvailableRooms({ rooms }) {
  const context = useNavContextProvider();
  const { t } = useTranslation();
  const formRef = useRef(null);
  const formContext = useBookingRoomSelectContextProvider();
  const [URLSearchParams] = useSearchParams();
  const location = useLocation();
  useEffect(() => {
    // reset form context states if new search params
    formContext.setGuestPool({
      adults: Number(URLSearchParams.get("adults")),
      children: Number(URLSearchParams.get("children")),
    });
  }, [URLSearchParams]);
  const fetcher = useFetcher({ key: "price_preview" });
  const handleFormChange = (e: ChangeEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    formData.set("_intent", "price_preview");
    fetcher.submit(formData, {
      method: "POST",
    });
  };
  return (
    <div id="available-rooms" className="flex flex-col items-center pt-10">
      {rooms.length === 0 ? (
        <div className="mt-5">
          <Fallback
            message={t(
              "No available rooms for these dates. Please check another date.",
            )}
          ></Fallback>
        </div>
      ) : (
        <div id="available-rooms" className="flex flex-col items-center pt-12">
          <h3 className="text-center text-nowrap">{t("Available rooms")}</h3>
          {context.fullImageView ? (
            <MediaFullView>
              <Carousel
                name="carousel-full-view"
                images={rooms[context.itemSelected].images}
                imageRes="original"
                imageSize="full"
                fullView={true}
              ></Carousel>
            </MediaFullView>
          ) : (
            ""
          )}
          <Form
            method="post"
            onChange={handleFormChange}
            ref={(node) => {
              formRef.current = node;
              formContext.setForm(node);
            }}
            key={URLSearchParams.toString()}
            id="room-select-form"
            className="grid lg:grid-cols-2 grid-cols-1  xl:gap-x-10 gap-x-7 xl:gap-y-14 gap-y-10"
          >
            {rooms.map((room: Room, index: number) => {
              return (
                <AvailableRoom
                  formRef={formRef}
                  key={room.name}
                  room={room}
                  index={index}
                ></AvailableRoom>
              );
            })}
          </Form>
        </div>
      )}
    </div>
  );
}
