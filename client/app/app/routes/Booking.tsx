import { axiosInstance } from '~/root';
import type { Route } from './+types/Booking'
import { Outlet, useLocation, useResolvedPath, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { redirect } from 'react-router';
import Line from '~/components/index/Line';
import AvailableRooms from '~/components/booking/AvailableRooms';
import ApiError from '~/components/except/ApiError';
import type { Room } from '~/types/booking';
import NavContextProvider from '~/components/nav/NavContextProvider';
import Header from '~/components/Header';
import ContextProvider from '~/components/ContextProvider';
import FloatingPanel from '~/components/booking/FloatingPanel';
import BookingRoomSelectContext from '~/components/booking/BookingRoomSelectContext';


export async function clientLoader({ request }) {
  const url = new URL(request.url)
  const response = await axiosInstance.get(`booking-request${url.search}`)
  console.log(response)
  return response
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const params = useSearchParams()
  return redirect(`/booking/confirm?${params.toString()}&rooms=${formData.get("rooms")}`)
}

export default function Booking({ loaderData }: Route.ComponentProps) {
  //handle loaderData
  const rooms = loaderData.status === 200 ? loaderData.data.rooms as Room[] : []
  const { t } = useTranslation()
  const location = useLocation()
  console.log('location pathanme', location.pathname)
  return <div className='bg-bg text-text-main'>
    <ContextProvider params={{ errors: [] }}>
      <Header bookingPannelEnabled={false}></Header>
      <div id="request-info-block" className='flex flex-col items-center mt-[42px]'>
        <h2 className='mb-10 -mt-2'>{t("Your booking request")}</h2>

        <Line />
        <div className='flex py-5 flex-col gap-3 items-center text-center 2xl:w-[600px]'>
          <div className='flex justify-between w-full font-medium'>
            <h4 className='w-[132px]'>Date</h4>
            <h4 className='w-50'>Number of guests</h4>
            <h4 className='w-[132px]'>Nights</h4>
          </div>
          <div className={`${location.pathname === '/booking' ? 'h-[68px]' : 'h-[80px]'} w-full transition-all duration-200`}>
            <Outlet></Outlet>
          </div>
        </div>
        <Line />
      </div>
      <div className='relative pt-10'>
        <BookingRoomSelectContext>
          <FloatingPanel rooms={rooms}></FloatingPanel>
          {
            loaderData.status === 200 ?
              <NavContextProvider>
                <AvailableRooms rooms={rooms}></AvailableRooms>
              </NavContextProvider>
              : <ApiError></ApiError>
          }
        </BookingRoomSelectContext>
      </div>

    </ContextProvider>
  </div>;
}
