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
  const { i18n, t } = useTranslation();
  const blockWidth = "w-[132px]";
  const guests = Number(adults) + Number(children);
  const langGlobal = i18n.language;
  const dateObj = new Date(date);
  const dateF = new Intl.DateTimeFormat([langGlobal, "en"], {
    dateStyle: "medium",
  });
  const dateString = dateF.format(dateObj);
  return (
    <div className="flex flex-col items-center w-full gap-2">
      <div className="text-center flex justify-between items-center w-full font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="font-light">{t("Check-in date") + ":"}</span>
          <p className={`${blockWidth} font-serif text-lg`}>{dateString}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="font-light">{t("Number of guests") + ":"}</span>
          <p className={`${blockWidth} font-serif text-lg`}>{guests}</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="font-light">{t("Nights") + ":"}</span>
          <p className={`${blockWidth} font-serif text-lg`}>{nights}</p>
        </div>
      </div>
      <Link
        className="underline
      font-sans
      font-light text-sm cursor-pointer"
        to={formUrl}
      >
        change
      </Link>
    </div>
  );
}
