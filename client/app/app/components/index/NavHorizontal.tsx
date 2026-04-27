import { useTranslation } from "react-i18next"

const RATING = 9.8

export default function NavHorizontal() {
  const { t } = useTranslation()
  return <div className="flex justify-center w-full mt-11">
    <div className="flex font-serif text-2xl font-light">
      <div className="w-[calc(40vw/3)] text-center underline hover:cursor-pointer">{t("About the house")}</div>
      <div className="w-[calc(40vw/3)] text-center underline hover:cursor-pointer">{t("Points of interest")}</div>
      <div className="w-[calc(40vw/3)] flex justify-center gap-3">
        <div className="underline hover:cursor-pointer">{t("Booking reviews")}</div>
        <div className="flex items-end gap-1">
          <div>{star}</div>
          <div className="font-serif">{RATING}</div>
        </div>
      </div>
    </div>
  </div>
}

const star = <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.8394 0L15.8703 9.32827H25.6786L17.7435 15.0935L20.7745 24.4217L12.8394 18.6565L4.90425 24.4217L7.93519 15.0935L9.25064e-05 9.32827H9.80842L12.8394 0Z" fill="#FB966E" />
</svg>
