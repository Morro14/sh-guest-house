import { useTranslation } from "react-i18next";
import { Form, redirect } from "react-router";
import Header from "~/components/Header";
import { axiosInstance } from "~/root";


export async function clientAction({ request }) {
  const formData = await request.formData()
  const response = await axiosInstance.post('booking/confirm', formData)
  console.log(response)
  return redirect('/booking/response')

}
export default function BookingSummary() {
  const { t } = useTranslation()
  return <div className="flex flex-col items-center min-h-screen min-w-screen text-text-main">
    <Header bookingPannelEnabled={false} />
    <div id="request-info-block" className='flex flex-col items-center my-8'>
      <h2>{t("Your booking request")}</h2>
    </div>
    <div className="index-container-1">
      <div className="grid grid-cols-10 font-sans">
        <div className="px-1 bg-olive col-span-1 ">Date</div>
        <div className=" col-span-9 bg-olive-light"></div>
        <div className="px-1 bg-olive-light col-span-1 ">Total price</div>
        <div className=" col-span-9 bg-olive"></div>
        <div className="px-1 bg-olive cwl-span-1 ">Rooms</div>
        <div className="col-span-9 bg-olive-light"></div>
        <div></div>
      </div>
      <Form method="post" className="flex flex-col w-[210px]">
        <input className="h-7 w-[210px] border-1 focus:border-bg border-gray-warm-inactive p-1 rounded font-sans" placeholder="user@email.com" name="email"></input>
        <button type="submit" className="w-[100px] text-lg font-medium bg-peach rounded">Book</button>
      </Form>
    </div>
  </div>
}
