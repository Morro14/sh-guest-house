import { useTranslation } from "react-i18next";
import {
  createSearchParams,
  redirect,
  Link,
  useFetcher,
  useNavigation,
} from "react-router";
import {
  formatPrice,
  getAxiosInstance,
  getLanguagePathParam,
} from "~/utils/general.ts";
import { Temporal } from "@js-temporal/polyfill";
import BookingSummaryRoom from "~/components/booking/BookingSummaryRoom";
import type { Room } from "~/types/booking";
import backArrow from "root/src/assets/back-arrow.svg";
import { useRouteError } from "react-router";
import Fallback from "~/components/Fallback";
import ErrorFallback from "~/components/ErrorFallback";
import { isAxiosError, type AxiosResponse } from "axios";
import { logError } from "~/utils/logging";
import { langCodes } from "~/utils/lang";

export function ErrorBoundary() {
  const error = useRouteError();
  logError(error);
  const { t } = useTranslation();

  if (isAxiosError(error)) {
    const sessionError = error.status === 403;
    return sessionError ? (
      <Fallback
        link={"/booking"}
        linkText={t("back to booking")}
        message={t("Your session has expired")}
      ></Fallback>
    ) : (
      <ErrorFallback />
    );
  } else return <ErrorFallback />;
}

export async function clientAction({ request, params }) {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  // return;
  const axiosInstance = getAxiosInstance();
  const formData = await request.formData();
  const response = (await axiosInstance.post(
    "booking/validate",
    formData,
  )) as AxiosResponse;
  return redirect(
    `/${params.lang}/booking/response?validated=${response.data.request_validated}&email=${response.data.user_email}`,
  );
}
interface GuestPerRoomSelected {
  slug: string;
  guests: {
    adults: number;
    children: number;
  };
}
interface LoaderData {
  guests_per_room_selected: GuestPerRoomSelected[];
  price_total: number;
  rooms: Room[];
  request_info: {
    adults: string;
    children: string;
    date: string;
    nights: string;
  };
}
export async function clientLoader() {
  const axiosInstance = getAxiosInstance();
  const response = await axiosInstance.get(`booking/request-summary`);
  return response;
}
export default function BookingSummary({ loaderData }) {
  const loaderDataClean: LoaderData = loaderData.data;
  const { t, i18n } = useTranslation();
  const {
    request_info: requestInfo,
    rooms,
    guests_per_room_selected: guestsInfo,
    price_total: price,
  } = loaderDataClean;
  const dateStart = Temporal.PlainDate.from(requestInfo.date);
  const nights = Number(requestInfo.nights);
  const dateEnd = dateStart.add({ days: nights });
  const formatDate = (date: Temporal.PlainDate) => {
    return date.toLocaleString(langCodes[i18n.language]);
  };
  const reservationSearchParams = createSearchParams({
    nights: requestInfo.nights,
    date: requestInfo.date,
    adults: requestInfo.adults,
    children: requestInfo.children,
  });
  const fetcher = useFetcher();
  const nav = useNavigation();
  return (
    <div className="flex flex-col gap-8 items-center min-h-screen min-w-screen font-sans">
      <div
        className={`sticky top-0 z-31 h-0.5 w-full ${nav.state !== "idle" ? "gradient-line" : "bg-primary"}`}
      ></div>
      <section>
        <div
          id="request-info-block"
          className="flex flex-col items-center mt-6"
        >
          <h3>{t("Your booking request")}</h3>
        </div>
        <div className="index-container-1">
          <div className="h-[1px] bg-gray-line w-full mb-4"></div>
          <div className="capitalize space-y-2">
            <div>
              <div className="text-gray-warm-mid text-sm">
                {t("date") + ":"}
              </div>
              <div className="text-lg">{`${formatDate(dateStart)} - ${formatDate(dateEnd)}`}</div>
            </div>
            <div>
              <div className="text-gray-warm-mid text-sm">
                {t("total price") + ":"}
              </div>
              <div className="text-lg">{formatPrice(price, "AMD")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-warm-mid text-sm">
                {t("rooms") + ":"}
              </div>
              <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,max-content))]">
                {rooms.map((room: Room) => {
                  const guestsSelected = guestsInfo.find(
                    (r) => r.slug === room.slug,
                  );
                  return BookingSummaryRoom(room);
                })}
              </div>
            </div>
          </div>
          <div className="h-[1px] bg-gray-line w-full my-6"></div>
          <Link
            to={`/${getLanguagePathParam()}/booking?${reservationSearchParams}`}
            className="flex gap-3"
          >
            <img src={backArrow} />
            <span className="font-sans  underline hover:cursor-pointer">
              {t("edit reservation")}
            </span>
          </Link>
        </div>
      </section>
      <section className="index-container-1">
        <h4>
          {t(
            "Please, provide your contact information to submit booking request",
          )}
        </h4>
        <p className="text-gray-warm-mid text-sm font-sans my-6">
          {t("booking summary paragraph")}
        </p>
        <fetcher.Form method="post" className="flex flex-col gap-5 w-[210px]">
          <div className="flex flex-col gap-1">
            <label htmlFor="email-input" className="font-sans">
              {t("Email")}
            </label>
            <p className="text-sm text-gray-warm-mid font-sans">
              {t("summary email help-text")}
            </p>
            <input
              id="email-input"
              className="h-7 w-[210px] border-1 focus:border-bg border-gray-warm-inactive p-1 rounded font-sans"
              placeholder="user@email.com"
              name="email"
            ></input>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="guest-name-input" className="font-sans">
              {t("Guest name")}
            </label>
            <p className="text-sm text-gray-warm-mid font-sans">
              {t("summary guest name help-text")}
            </p>
            <input
              id="guest-name-input"
              className="h-7 w-[210px] border-1 focus:border-bg border-gray-warm-inactive p-1 rounded font-sans"
              placeholder="Name Surname"
              name="guest-name"
            ></input>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="guest-name-input" className="font-sans">
              {t("Message")}
            </label>
            <p className="text-sm text-gray-warm-mid font-sans">
              {t(
                "Please let us know the time of your arrival and any additional information related to your stay.",
              )}
            </p>
            <textarea
              id="client-message-input"
              className="w-[210px] border-1 focus:border-bg border-gray-warm-inactive p-1 rounded font-sans"
              rows={3}
              name="client-message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="min-w-[120px] h-10 text-lg font-medium bg-primary capitalize rounded font-sans text-white mt-6 cursor-pointer hover:bg-primary-light"
          >
            {fetcher.state === "idle" ? t("confirm") : t("submitting...")}
          </button>
        </fetcher.Form>
      </section>
    </div>
  );
}
