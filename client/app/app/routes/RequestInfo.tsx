import { useTranslation } from "react-i18next";
import {
  Link,
  NavLink,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router";
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
    <div className="flex flex-col items-center w-full md:gap-2 gap-3">
      <div className="flex md:flex-row flex-col max-md:gap-3 text-center justify-between items-center w-full font-sans">
        <div className="flex flex-col items-center md:gap-3 gap-0">
          <span className="text-gray-warm-mid text-sm">
            {t("Check-in date")}
          </span>
          <p className={`${blockWidth} font-sans text-lg`}>{dateString}</p>
        </div>
        <div className="flex flex-col items-center md:gap-3 gap-0">
          <span className="text-gray-warm-mid text-sm">
            {t("Number of guests")}
          </span>
          <p className={`${blockWidth} font-sans text-lg`}>{guests}</p>
        </div>
        <div className="flex flex-col items-center md:gap-3 gap-0">
          <span className="text-gray-warm-mid text-sm">{t("Nights")}</span>
          <p className={`${blockWidth} font-sans text-lg`}>{nights}</p>
        </div>
      </div>
      <NavLink
        className={`underline font-source-sans font-light text-sm cursor-pointer`}
        to={formUrl}
      >
        {({ isPending }) => (
          <span>{isPending ? t("loading...") : t("change")}</span>
        )}
      </NavLink>
    </div>
  );
}
