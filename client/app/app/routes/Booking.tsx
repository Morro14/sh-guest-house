import { axiosInstance } from '~/root';
import type { Route } from './+types/Booking'
import { Link, Outlet, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { validate } from '~/components/formComponents/validate';
import { redirect } from 'react-router';
import Line from '~/components/index/Line';
import AvailableRooms from '~/components/booking/AvailableRooms';
import ApiError from '~/components/except/ApiError';
import type { Room } from '~/types/booking';
import NavContextProvider from '~/components/nav/NavContextProvider';
import Header from '~/components/Header';
import ContextProvider from '~/components/ContextProvider';



export async function clientLoader({ request }) {
  const url = new URL(request.url)
  const params = (url.searchParams)
  // console.log(params)
  const response = await axiosInstance.get(`booking-request${url.search}`)
  console.log(response)
  return response
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const validations = validate(formData);
  const errors = validations.filter((v) => !v.valid);
  if (errors.length > 0) {
    return { status: "vaildationError", errors };
  }
  let formDataObj = {}
  for (const [k, v] of formData.entries()) {
    formDataObj[k] = (v.toString())
  }
  const params = new URLSearchParams(
    formDataObj
  )
  return redirect(`/booking?${params}`)
  const response = await axiosInstance.get(`booking-request?${params}`)
  console.log('response', response)
}

export default function Booking({ actionData, loaderData }: Route.ComponentProps) {
  // handle actionData
  const errors = actionData?.errors ? actionData.errors : []
  //handle loaderData
  const rooms = loaderData.status === 200 ? loaderData.data.rooms as Room[] : []
  const { t } = useTranslation()
  return <div className='bg-bg text-text-main'>
    <ContextProvider params={{ errors: errors }}>
      <Header bookingPannelEnabled={false}></Header>
      <div className='flex flex-col items-center mt-[42px]'>
        <h1 className='mb-12'>{t("Your booking request")}</h1>
        <Line />
        {<div className='flex py-5 flex-col gap-3 items-center text-center 2xl:w-[600px] h-[200px]'>
          <div className='flex justify-between w-full font-medium'>
            <h4 className='w-[132px]'>Date</h4>
            <h4 className='w-50'>Number of guests</h4>
            <h4 className='w-[132px]'>Nights</h4>
          </div>
          <Outlet></Outlet>
        </div>
        }
        <Line />
        <div className='index-container-1 flex flex-col gap-9 mt-10'>
          <h2 className='text-center text-nowrap'>{rooms.length > 0 ? t('Available rooms') : t("No available rooms for these dates. Check the next available dates for booking below.")}</h2>
        </div>
      </div>
      {
        loaderData.status === 200 ?
          <NavContextProvider>
            <AvailableRooms rooms={rooms}></AvailableRooms>
          </NavContextProvider>
          : <ApiError></ApiError>
      }

    </ContextProvider>
  </div>;
}
