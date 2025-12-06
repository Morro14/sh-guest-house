import { useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router"
import { getUrlSearchParams } from "~/utils/general"


export default function RequestInfo() {
  const { date, adults, children, days } = getUrlSearchParams(['date', 'adults', 'children', 'days'])
  const [URLSearchParams] = useSearchParams()
  const formUrl = "/booking/form?" + URLSearchParams.toString()
  const { i18n } = useTranslation()
  const blockWidth = "w-[132px] pt-2"
  const guests = Number(adults) + Number(children)
  const lang = i18n.language
  const dateObj = new Date(date)
  const dateUTC = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  const dateF = new Intl.DateTimeFormat([lang, "en"], { dateStyle: "full" })
  const dateString = dateF.format(dateUTC)
  return <div className="flex flex-col items-center w-full">
    <div className="text-center flex justify-between items-center w-full">
      <p className={`${blockWidth}`}>{dateString}</p>
      <p className={`${blockWidth} font-medium`}>{guests}</p>
      <p className={`${blockWidth} font-medium`}>{days}</p>

    </div>
    <Link
      className='underline
      font-sans
      font-light cursor-pointer'
      to={formUrl}
    >change
    </Link>
  </div>
}
