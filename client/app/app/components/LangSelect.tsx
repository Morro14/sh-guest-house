import { LANGUAGES } from "~/vars";
import { useLocation, useNavigate, useParams } from "react-router";
import type { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";

export default function LangSelect() {
  const { i18n } = useTranslation();
  const languageLabels = { en: "English", ru: "Русский" };
  const params = useParams();
  const loc = useLocation();
  const nav = useNavigate();
  const handleChange = (e: SyntheticEvent<HTMLSelectElement>) => {
    const segments = loc.pathname.split("/");
    segments[1] = e.target.value;
    i18n.changeLanguage(e.target.value);
    nav(segments.join("/"));
  };
  return (
    <div>
      <select
        name="lang-select"
        onChange={handleChange}
        defaultValue={params.lang}
      >
        {LANGUAGES.map((lang) => {
          return (
            <option key={"opt-lang-" + lang} value={lang}>
              {languageLabels[lang]}
            </option>
          );
        })}
      </select>
    </div>
  );
}
