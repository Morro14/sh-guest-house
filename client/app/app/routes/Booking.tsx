import { axiosInstance, getLanguagePathParam } from "~/utils/general.ts";
import type { Route } from "./+types/Booking";
import { Outlet, useLocation, redirect, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import Line from "~/components/index/Line";
import AvailableRooms from "~/components/booking/AvailableRooms";
import type { Room } from "~/types/booking";
import NavContextProvider from "~/components/nav/NavContextProvider";
import RequestAvailableRoomsContextProvider from "~/components/RequestAvailableRoomsContextProvider";
import FloatingPanel from "~/components/booking/FloatingPanel";
import BookingRoomSelectContext from "~/components/booking/BookingRoomSelectContext";
import { getDefaultSearchParams } from "~/utils/general";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import ErrorFallback from "~/components/ErrorFallback";
import type { AxiosResponse } from "axios";
import { logError } from "~/utils/logging";
import { useRouteError } from "react-router";
import { useEffect } from "react";

export function ErrorBoundary() {
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
  return <ErrorFallback />;
}

export function shouldRevalidate({
  formData,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  const intent = formData?.get("_intent");

  if (intent === "price_preview") {
    return false;
  }
  return defaultShouldRevalidate;
}

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const allParams =
    url.searchParams.has("date") &&
    url.searchParams.has("adults") &&
    url.searchParams.has("children") &&
    url.searchParams.has("nights");

  if (!allParams) {
    const defaultParamsObj = getDefaultSearchParams();
    const defaultParams = new URLSearchParams(defaultParamsObj);
    return redirect(
      `/${getLanguagePathParam(url.pathname)}/booking?${defaultParams}`,
    );
  }
  const response = await axiosInstance.get(`booking/request${url.search}`);
  return response as AxiosResponse;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  if (formData.get("_intent") === "price_preview") {
    const response = await axiosInstance.post(
      `booking/reservation-price`,
      formData,
    );
    return response.data;
  } else {
    await axiosInstance.post("booking/request-summary", formData);
    return redirect(`/${getLanguagePathParam()}/booking/confirm`);
  }
}

export default function Booking({ loaderData }: Route.ComponentProps) {
  const rooms = loaderData.data.rooms as Room[];

  const { t } = useTranslation();
  const fetcher = useFetcher({ key: "price_preview" });
  const location = useLocation();
  return (
    <div className="bg-bg text-text-main min-h-screen min-w-screen">
      <RequestAvailableRoomsContextProvider params={{ errors: [] }}>
        <div
          id="request-info-block"
          className="flex flex-col items-center mt-8.5"
        >
          <h2 className="mb-8 ">{t("Your booking request")}</h2>

          <Line />
          <div className="flex py-5 flex-col gap-3 items-center text-center 2xl:w-150">
            <div className="flex capitalize justify-between w-full font-light font-sans">
              <span className="w-33 ">{t("date")}</span>
              <span className="w-50">{t("number of guests")}</span>
              <span className="w-33">{t("nights")}</span>
            </div>
            <div
              className={`${location.pathname.split("/").at(-1) === "booking" ? "h-16" : "h-22"} w-full transition-all duration-200`}
            >
              <Outlet></Outlet>
            </div>
          </div>
          <Line />
        </div>
        <div
          className={`relative transition-all ${location.pathname.split("/").at(-1) === "change-request-info" ? "grayscale opacity-50 pointer-events-none" : ""}`}
        >
          <BookingRoomSelectContext priceFetcher={fetcher}>
            <FloatingPanel></FloatingPanel>
            <NavContextProvider>
              <AvailableRooms rooms={rooms}></AvailableRooms>
            </NavContextProvider>
          </BookingRoomSelectContext>
        </div>
      </RequestAvailableRoomsContextProvider>
    </div>
  );
}
