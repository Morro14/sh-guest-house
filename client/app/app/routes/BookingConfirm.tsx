import { useTranslation } from "react-i18next";
import Header from "~/components/Header";

export default function BookingConfirm() {
  const { t } = useTranslation()
  return <div className="flex flex-col items-center min-h-screen min-w-screen text-text-main">
    <Header bookingPannelEnabled={false} />
    <div id="request-info-block" className='flex flex-col items-center my-8'>
      <h2>{t("Your booking request")}</h2>
    </div>
    <div className="index-container-1">
      <div className="grid grid-cols-10">
        <div className="bg-olive col-span-2 h-4"></div>
        <div className="h-4 col-span-8 bg-olive-light"></div>
        <div></div>
      </div>
    </div>
  </div>
}
