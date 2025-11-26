import { useTranslation } from "react-i18next"

export default function RequestInfo({ date, adults, children, days }) {
  const { t, i18n } = useTranslation()
  const blockWidth = "w-[132px] pt-2"
  const guests = Number(adults) + Number(children)
  const lang = i18n.language
  const dateObj = new Date(date)
  const dateUTC = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate())
  const dateF = new Intl.DateTimeFormat([lang, "en"], { dateStyle: "full" })
  console.log(lang, dateF.format(dateUTC))
  const dateString = dateF.format(dateUTC)
  return <div className="text-center flex justify-between w-full">
    <p className={`${blockWidth}`}>{dateString}</p>
    <p className={`${blockWidth} font-medium`}>{guests}</p>
    <p className={`${blockWidth} font-medium`}>{days}</p>

  </div>

}
