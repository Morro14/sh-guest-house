import { axiosInstance } from "~/root";
import type { Route } from "./+types/Booking";
import { Outlet, useLocation, redirect, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import Line from "~/components/index/Line";
import AvailableRooms from "~/components/booking/AvailableRooms";
import type { Room } from "~/types/general";
import NavContextProvider from "~/components/nav/NavContextProvider";
import ContextProvider from "~/components/ContextProvider";
import FloatingPanel from "~/components/booking/FloatingPanel";
import BookingRoomSelectContext from "~/components/booking/BookingRoomSelectContext";
import { getDefaultSearchParams } from "~/utils/general";
import { isRouteErrorResponse, useRouteError } from "react-router";
import Fallback from "~/components/Fallback";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { data } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();
  // const isRouteErrorResponseValue = isRouteErrorResponse(error);
  const { t } = useTranslation();

  console.log("error boundary", error);
  if (isRouteErrorResponse(error)) {
    const sessionError = error.status === 403;
    return sessionError ? (
      <Fallback
        link={"booking"}
        linkText={t("back to booking")}
        message={t("Your session has expired")}
      ></Fallback>
    ) : (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
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
    return redirect(`/booking?${defaultParams}`);
  }
  const response = await axiosInstance.get(`booking/request${url.search}`);
  console.log(response);
  return response;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  if (formData.get("_intent") === "price_preview") {
    console.log("price_preview");
    const response = await axiosInstance.post(
      `booking/reservation-price`,
      formData,
    );
    console.log("response action", response);
    return response.data;
  } else {
    const response = await axiosInstance.post(
      "booking/request-summary",
      formData,
    );
    console.log("booking confirm response", response);
    return redirect(`/booking/confirm`);
  }
}

export default function Booking({ loaderData }: Route.ComponentProps) {
  const rooms =
    loaderData.status === 200 ? (loaderData.data.rooms as Room[]) : [];
  const { t } = useTranslation();
  const fetcher = useFetcher({ key: "price_preview" });
  console.log("price preview action data", fetcher);
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
