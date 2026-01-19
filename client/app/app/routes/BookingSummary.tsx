import { useTranslation } from "react-i18next";
import { createSearchParams, Form, redirect, Link } from "react-router";
import Header from "~/components/Header";
import { axiosInstance } from "~/root";
import { Temporal } from "@js-temporal/polyfill";
import { formatPrice } from "~/utils/general.ts";
import BookingSummaryRoom from "~/components/booking/BookingSummaryRoom";
import type { Room } from "~/types/booking";
import backArrow from "root/src/assets/back-arrow.svg";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const response = await axiosInstance.post("booking/validate", formData);
  console.log(response);
  return redirect(
    `/booking/response?validated=${response.data.request_validated}&email=${response.data.user_email}`,
  );
}
export async function clientLoader() {
  const response = await axiosInstance.get("booking/request-summary");
  console.log("request-summary get:", response);
  return response;
}
export default function BookingSummary({ loaderData }) {
  const { t } = useTranslation();
  const {
    request_info: requestInfo,
    rooms,
    guests_per_room_selected: guestsInfo,
    price_total: price,
  } = loaderData.data;
  const dateStart = Temporal.PlainDate.from(requestInfo.date);
  const days = Number(requestInfo.days);
  const dateEnd = dateStart.add({ days: days });

  const reservationSearchParams = createSearchParams({
    days: requestInfo.days,
    date: requestInfo.date,
    adults: requestInfo.adults,
    children: requestInfo.children,
  });

  return (
    <div className="flex flex-col items-center min-h-screen min-w-screen text-text-main">
      <Header bookingPannelEnabled={false} />
      <div id="request-info-block" className="flex flex-col items-center mt-6">
        <h3>{t("Your booking request")}</h3>
      </div>
      <div className="index-container-1">
        <div className="h-[1px] bg-gray-warm w-full mb-4"></div>
        <div className="grid grid-cols-10 font-sans">
          <div className="px-1  col-span-1 ">Date</div>
          <div className=" col-span-9 font-serif">{`${dateStart.toLocaleString()} - ${dateEnd.toLocaleString()}`}</div>
          <div className="px-1  col-span-1 ">Total price</div>
          <div className=" col-span-9 font-serif">
            {formatPrice(price, "AMD")}
          </div>
          <div className="px-1  cwl-span-1 ">Rooms</div>
          <div className="col-span-9 ">
            {rooms.map((room: Room) => {
              const guestsSelected = guestsInfo.find(
                (r) => r.slug === room.slug,
              );
              return BookingSummaryRoom(room, guestsSelected.guests);
            })}
          </div>
        </div>
        <div className="h-[1px] bg-gray-warm w-full my-6"></div>
        <Link to={`/booking?${reservationSearchParams}`} className="flex gap-3">
          <img src={backArrow} />
          <span className="font-sans font-light underline hover:cursor-pointer">
            {t("edit reservation")}
          </span>
        </Link>
        <p className="text-gray-warm-mid text-sm font-sans my-6">
          {t("booking summary paragraph")}
        </p>
        <Form method="post" className="flex flex-col gap-3 w-[210px]">
          <div>
            <label htmlFor="email-input" className="font-sans">
              {t("Email")}
            </label>
            <p className="text-sm text-gray-warm-mid font-sans">
              {t("summary email help-text")}
            </p>
          </div>
          <input
            id="email-input"
            className="h-7 w-[210px] border-1 focus:border-bg border-gray-warm-inactive p-1 rounded font-sans"
            placeholder="user@email.com"
            name="email"
          ></input>
          <button
            type="submit"
            className="w-[100px] text-lg font-medium bg-peach rounded font-sans text-bg mt-2 cursor-pointer hover:bg-peach-accent"
          >
            Book
          </button>
        </Form>
      </div>
    </div>
  );
}
