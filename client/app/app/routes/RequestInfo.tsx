import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import { getUrlSearchParams, getDefaultSearchParams } from "~/utils/general";

export default function RequestInfo() {
  const {
    date: dateParam,
    adults: adultsParam,
    children: childrenParam,
    nights: nightsParam,
  } = getUrlSearchParams(["date", "adults", "children", "nights"]);
  const {
    date: defaultDate,
    adults: defaultAdults,
    children: defaultChildren,
    nights: defaultNights,
  } = getDefaultSearchParams();
  const [date, adults, children, nights] = [
    dateParam || defaultDate,
    adultsParam || defaultAdults,
    childrenParam || defaultChildren,
    nightsParam || defaultNights,
  ];
  const [URLSearchParams] = useSearchParams();
  const formUrl = "/booking/change-request-info?" + URLSearchParams.toString();
  const { i18n } = useTranslation();
  const blockWidth = "w-[132px] pt-2";
  const guests = Number(adults) + Number(children);
  const lang = i18n.language;
  const dateObj = new Date(date);
  const dateF = new Intl.DateTimeFormat([lang, "en"], { dateStyle: "medium" });
  const dateString = dateF.format(dateObj);
  return (
    <div className="flex flex-col items-center w-full gap-3">
      <div className="text-center flex justify-between items-center w-full">
        <p className={`${blockWidth}`}>{dateString}</p>
        <p className={`${blockWidth} font-medium`}>{guests}</p>
        <p className={`${blockWidth} font-medium`}>{nights}</p>
      </div>
      <Link
        className="underline
      italic
      font-sans
      font-light cursor-pointer"
        to={formUrl}
      >
        change
      </Link>
    </div>
  );
}
