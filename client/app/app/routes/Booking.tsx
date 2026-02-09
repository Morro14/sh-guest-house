import { axiosInstance, getLanguagePathParam } from "~/utils/general.ts";
import type { Route } from "./+types/Booking";
import { Outlet, useLocation, redirect, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import Line from "~/components/index/Line";
import AvailableRooms from "~/components/booking/AvailableRooms";
import type { Room } from "~/types/booking";
import NavContextProvider from "~/components/nav/NavContextProvider";
import ContextProvider from "~/components/ContextProvider";
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
  console.log("error router boundary", error);
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

    return redirect(`/booking/confirm`);
  }
}

export default function Booking({ loaderData }: Route.ComponentProps) {
  const rooms = loaderData.data.rooms as Room[];

  const { t } = useTranslation();
  const fetcher = useFetcher({ key: "price_preview" });
  const location = useLocation();
  return (
    <div className="bg-bg text-text-main">
      <ContextProvider params={{ errors: [] }}>
        <div
          id="request-info-block"
          className="flex flex-col items-center mt-[34px]"
        >
          <h2 className="mb-8 ">{t("Your booking request")}</h2>

          <Line />
          <div className="flex py-5 flex-col gap-3 items-center text-center 2xl:w-[600px]">
            <div className="flex justify-between w-full font-medium">
              <h4 className="w-[132px]">Date</h4>
              <h4 className="w-50">Number of guests</h4>
              <h4 className="w-[132px]">Nights</h4>
            </div>
            <div
              className={`${location.pathname === "/booking" ? "h-[68px]" : "h-[80px]"} w-full transition-all duration-200`}
            >
              <Outlet></Outlet>
            </div>
          </div>
          <Line />
        </div>
        <div
          className={`relative transition-all ${location.pathname === "/booking/change-request-info" ? "grayscale opacity-50 pointer-events-none" : ""}`}
        >
          <BookingRoomSelectContext priceFetcher={fetcher}>
            <FloatingPanel></FloatingPanel>
            <NavContextProvider>
              <AvailableRooms rooms={rooms}></AvailableRooms>
            </NavContextProvider>
          </BookingRoomSelectContext>
        </div>
      </ContextProvider>
    </div>
  );
}
