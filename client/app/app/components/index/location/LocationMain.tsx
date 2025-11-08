import { Link } from "react-router"
import mapImg from "root/src/assets/map.png"
import googleMapsIcon from "root/src/assets/google-map-icon.svg"
import { useTranslation } from "react-i18next"


export default function LocationMain() {
  const { t } = useTranslation()
  return <div className="flex flex-col gap-3">
    <div className="flex items-end col-span-2 font-sans gap-5 font-medium text-lg">
      <Link to="" className="flex gap-2 underline"><img className="w-4" src={googleMapsIcon} /><div>Open in Google Maps</div></Link>
      <Link to="" className="underline">Open a written guide</Link>
      <Link to="" className="underline">Shuttle from Yeghegnadzor</Link>
    </div>
    <div className="flex gap-4">
      <div className="2xl:w-[688px] flex relative ">
        <img className="" src={mapImg} />

        <svg className="absolute left-[278px] top-[60px]" width="273" height="173" viewBox="0 0 273 173" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M270.589 170.749C270.589 170.749 265.614 166.366 261.327 157.291C256.765 147.633 259.07 140.327 253.19 131.412C246.305 120.973 243.825 121.897 240.045 115.963C236.182 109.898 236.735 105.38 231.908 100.309C216.409 84.0286 200.469 70.6995 195.604 72.7575C188.204 75.8877 184.714 84.2767 176.2 90.2903C164.484 98.5648 157.542 103.887 143.592 107.216C130.268 110.395 106.113 106.027 106.113 106.027L115.484 84.6547C115.484 84.6547 96.0139 76.9861 79.3417 70.3607C62.6694 63.7352 58.5199 63.8218 40.6726 56.0941C26.4034 49.9156 2.00358 29.3443 2.00358 29.3443C2.00358 29.3443 1.78856 19.1553 4.6935 14.5234C7.47375 10.0904 16.5863 2 16.5863 2" stroke="#EA4335" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex justify-center items-center absolute bg-[#00000030]  2xl:w-[688px] 2xl:h-[458px]">
          <div className="flex flex-col gap-3 text-center font-sans text-lg">
            <Link className="h-8 px-4 rounded-2 bg-olive-light-transparent hover:bg-olive-light flex items-center justify-center" to=""><div>Open in Google Maps</div></Link>
            <Link className="h-8 px-4 rounded-2 bg-olive-light-transparent hover:bg-olive-light flex items-center justify-center" to=""><div>Open route guide</div></Link>
          </div>

        </div>
      </div>
      <div className="flex flex-col gap-3 font-light font-sans">
        {/* Image */}
        <div>
          <div className="2xl:w-[296px] 2xl:h-[98px] bg-gray-warm"></div>
          <p className="">{t("locationSideText.one")}</p>
        </div>
        <div>
          {/* Image */}
          <div className="2xl:w-[296px] 2xl:h-[98px] bg-gray-warm"></div>
          <p className="">{t("locationSideText.two")}</p>
        </div>
      </div>
    </div>
  </div>
}
