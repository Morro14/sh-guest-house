import { axiosInstance } from "~/root";
import type { Route } from "./+types/Booking";
import { Outlet, useLocation, redirect, data } from "react-router";
import { useTranslation } from "react-i18next";
import Line from "~/components/index/Line";
import AvailableRooms from "~/components/booking/AvailableRooms";
import type { Room } from "~/types/booking";
import NavContextProvider from "~/components/nav/NavContextProvider";
import Header from "~/components/Header";
import ContextProvider from "~/components/ContextProvider";
import FloatingPanel from "~/components/booking/FloatingPanel";
import BookingRoomSelectContext from "~/components/booking/BookingRoomSelectContext";
import { getDefaultSearchParams } from "~/utils/general";

export async function clientLoader({ request }) {
  const url = new URL(request.url);
  const allParams =
    url.searchParams.get("date") &&
    url.searchParams.get("adults") &&
    url.searchParams.get("children") &&
    url.searchParams.get("days");
  // default search params
  if (!allParams) {
    const defaultParamsObj = getDefaultSearchParams();
    const defaultParamsObjStringValues = Object.fromEntries(
      Object.entries(defaultParamsObj).map(([k, v]) => [k, String(v)]),
    );
    const defaultParams = new URLSearchParams(defaultParamsObjStringValues);
    const response = await axiosInstance.get(
      `booking/request?${defaultParams}`,
    );
    console.log(response);
    return response;
  }

  const response = await axiosInstance.get(`booking/request${url.search}`);
  console.log(response);
  return response;
}

// TODO
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  console.log("select rooms from data", formData);
  const response = await axiosInstance.post(
    "booking/request-summary",
    formData,
  );
  console.log("booking confirm response", response);
  return redirect(`/booking/confirm`);
}

export default function Booking({ loaderData }: Route.ComponentProps) {
  const rooms =
    loaderData.status === 200 ? (loaderData.data.rooms as Room[]) : [];
  const { t } = useTranslation();
  const location = useLocation();

  // useEffect(() => {
  //   if (!loaderData.data.key) {
  //     return
  //   }
  //   const key = loaderData.data.key
  //   const url = new URL(window.location.href)
  //   url.searchParams.set("rk", key)
  //   window.history.replaceState(null, "", url)
  // }, [loaderData])

  return (
    <div className="bg-bg text-text-main">
      <ContextProvider params={{ errors: [] }}>
        <Header bookingPannelEnabled={false}></Header>
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
          <BookingRoomSelectContext rooms={rooms}>
            <FloatingPanel rooms={rooms}></FloatingPanel>
            <NavContextProvider>
              <AvailableRooms rooms={rooms}></AvailableRooms>
            </NavContextProvider>
          </BookingRoomSelectContext>
        </div>
      </ContextProvider>
    </div>
  );
}
