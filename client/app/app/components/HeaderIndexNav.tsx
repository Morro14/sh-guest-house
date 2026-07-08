import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

export default function HeaderIndexNav() {
  const { t, i18n } = useTranslation();
  return (
    <div className="lg:flex gap-5 2xl:gap-10 hidden justify-center font-serif font-light w-1/3 text-nowrap">
      <NavLink
        to={`/${i18n.language}?scroll-to=about`}
        className="hover:underline"
      >
        {t("About")}
      </NavLink>
      <NavLink
        to={`/${i18n.language}?scroll-to=contacts`}
        className="hover:underline"
      >
        {t("Contacts")}
      </NavLink>
      <NavLink
        to={`/${i18n.language}?scroll-to=location`}
        className="hover:underline"
      >
        {t("Location")}
      </NavLink>
      <NavLink to={`/${i18n.language}/map`} className="hover:underline">
        {t("Points of interest")}
      </NavLink>
    </div>
  );
}
