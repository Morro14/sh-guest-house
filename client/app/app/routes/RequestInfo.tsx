import { useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router"
import { getUrlSearchParams, getDefaultSearchParams } from "~/utils/general"


export default function RequestInfo() {
  const { date: dateParam, adults: adultsParam, children: childrenParam, days: daysParam } = getUrlSearchParams(['date', 'adults', 'children', 'days'])
  const { date: defaultDate, adults: defaultAdults, children: defaultChildren, days: defaultDays } = getDefaultSearchParams()
  const [date, adults, children, days] = [dateParam || defaultDate, adultsParam || defaultAdults, childrenParam || defaultChildren, daysParam || defaultDays]
  const [URLSearchParams] = useSearchParams()
  const formUrl = "/booking/form?" + URLSearchParams.toString()
  const { i18n } = useTranslation()
  const blockWidth = "w-[132px] pt-2"
  const guests = Number(adults) + Number(children)
  const lang = i18n.language
  const dateObj = new Date(date)
  const dateUTC = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  const dateF = new Intl.DateTimeFormat([lang, "en"], { dateStyle: "medium" })
  const dateString = dateF.format(dateUTC)
  return <div className="flex flex-col items-center w-full gap-3">
    <div className="text-center flex justify-between items-center w-full">
      <p className={`${blockWidth}`}>{dateString}</p>
      <p className={`${blockWidth} font-medium`}>{guests}</p>
      <p className={`${blockWidth} font-medium`}>{days}</p>

    </div>
    <Link
      className='underline
      italic
      font-sans
      font-light cursor-pointer'
      to={formUrl}
    >change
    </Link>
  </div>
}
