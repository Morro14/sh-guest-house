import { useTranslation } from "react-i18next";
import { Link, useParams, useSearchParams } from "react-router";
import { getUrlSearchParams } from "~/utils/general";

export default function RequestInfo() {
  const { date, adults, children, nights } = getUrlSearchParams([
    "date",
    "adults",
    "children",
    "nights",
  ]);
  const [URLSearchParams] = useSearchParams();
  const { lang } = useParams();
  const formUrl =
    `/${lang}/booking/change-request-info?` + URLSearchParams.toString();
  const { i18n } = useTranslation();
  const blockWidth = "w-[132px] pt-2";
  const guests = Number(adults) + Number(children);
  const langGlobal = i18n.language;
  const dateObj = new Date(date);
  const dateF = new Intl.DateTimeFormat([langGlobal, "en"], {
    dateStyle: "medium",
  });
  const dateString = dateF.format(dateObj);
  return (
    <div className="flex flex-col items-center w-full gap-3">
      <div className="text-center flex justify-between items-center w-full ">
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
