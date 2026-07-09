import {
  getAxiosInstance,
  getLanguagePathParam,
  getUrlSearchParams,
} from "~/utils/general.ts";
import type { Route } from "./+types/Booking";
import {
  isRouteErrorResponse,
  Outlet,
  useLocation,
  redirect,
  useFetcher,
  useNavigation,
} from "react-router";
import { useTranslation } from "react-i18next";
import AvailableRooms from "~/components/booking/AvailableRooms";
import type { Room } from "~/types/booking";
import NavContextProvider from "~/components/nav/NavContextProvider";
import IndexBookingContextProvider from "~/components/booking/IndexBookingContextProvider";
import FloatingPanel from "~/components/booking/FloatingPanel";
import BookingRoomSelectContext from "~/components/booking/BookingRoomSelectContext";
import { getDefaultSearchParams } from "~/utils/general";
import type {
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs,
} from "react-router";
import ErrorFallback from "~/components/ErrorFallback";
import type { AxiosResponse } from "axios";
import { logError } from "~/utils/logging";
import { useRouteError } from "react-router";
import { useEffect } from "react";
import Fallback from "~/components/Fallback";
import { isAxiosError } from "axios";

export function ErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();
  useEffect(() => {
    logError(error);
  }, [error]);
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

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const allParams =
    url.searchParams.has("date") &&
    url.searchParams.has("adults") &&
    url.searchParams.has("children") &&
    url.searchParams.has("nights");

  if (!allParams) {
    const defaultParamsObj = getDefaultSearchParams();
    const defaultParams = new URLSearchParams(defaultParamsObj);
    const currentPath = new URL(request.url).pathname;
    console.log("currentPath", currentPath);
    return redirect(`${currentPath}?${defaultParams}`);
  }
  const axiosInstance = getAxiosInstance();
  const response = await axiosInstance.get(`booking/request${url.search}`);
  return response as AxiosResponse;
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const formData = await request.formData();
  const axiosInstance = getAxiosInstance();
  if (formData.get("_intent") === "price_preview") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await axiosInstance.post(
      `booking/reservation-price`,
      formData,
    );
    return response.data;
  } else {
    await axiosInstance.post("booking/request-summary", formData);
    return redirect(`/${params.lang}/booking/confirm`);
  }
}

export default function Booking({ loaderData }: Route.ComponentProps) {
  const rooms = loaderData.data.rooms as Room[];

  const { t } = useTranslation();
  const fetcher = useFetcher({ key: "price_preview" });
  const location = useLocation();
  const nav = useNavigation();
  return (
    <div className="bg-bg text-text-main min-h-screen min-w-screen">
      <div
        className={`sticky top-0 z-31 h-0.5 w-full ${nav.state !== "idle" ? "gradient-line" : "bg-primary"}`}
      ></div>
      <IndexBookingContextProvider params={{ errors: [] }}>
        <div
          id="request-info-block"
          className="flex flex-col items-center md:mt-8.5 mt-7"
        >
          <h2 className="max-md:mb-7!">{t("Your booking request")}</h2>

          {/* <Line /> */}
          <div className="flex mb-7 flex-col gap-3 items-center text-center md:w-150">
            <div
              className={`${location.pathname.split("/").at(-1) === "booking" ? "md:h-22.5" : "md:h-22.5 h-70 mb-4"} w-full transition-all duration-200`}
            >
              <Outlet></Outlet>
            </div>
          </div>
          {/* <Line /> */}
        </div>
        <div
          className={`relative flex justify-center transition-all ${location.pathname.split("/").at(-1) === "change-request-info" ? "grayscale opacity-50 pointer-events-none" : ""}`}
          inert={
            location.pathname.split("/").at(-1) === "change-request-info"
              ? true
              : false
          }
        >
          <BookingRoomSelectContext priceFetcher={fetcher}>
            <FloatingPanel></FloatingPanel>
            <NavContextProvider>
              <AvailableRooms rooms={rooms}></AvailableRooms>
            </NavContextProvider>
          </BookingRoomSelectContext>
        </div>
      </IndexBookingContextProvider>
    </div>
  );
}
