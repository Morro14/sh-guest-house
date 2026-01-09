import { useTranslation } from "react-i18next"
import Header from "~/components/Header"
import { axiosInstance } from "~/root"
import type { Route } from "./+types/BookingConfirmResponse"


export async function clientLoader() {
  const response = await axiosInstance.get('booking/confirm')
  console.log('booking confirm response', response)
  return response

}
export default function BookingConfirmResponse({ loaderData }: Route.ComponentProps) {
  const email = loaderData
  const { t } = useTranslation()
  return <div className="flex flex-col items-center min-h-screen min-w-screen text-text-main">
    <Header bookingPannelEnabled={false} />
    <div id="request-info-block" className='flex flex-col items-center my-8'>
      <h2>{t("Your booking request has been submitted!")}</h2>
    </div>
    <div className="index-container-1">
      <p className="font-sans">{t("booking-success-contact-msg", { email })}</p>
    </div>
  </div>
}
