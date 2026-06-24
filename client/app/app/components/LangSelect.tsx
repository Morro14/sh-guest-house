import { LANGUAGES } from "~/vars";
import { useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";

export default function LangSelect() {
  const { i18n } = useTranslation();
  const languageLabels = { en: "English", ru: "Русский" };
  const nav = useNavigate();
  const params = useParams();
  const loc = useLocation();
  const handleChange = (e) => {
    const pathWithoutLang = loc.pathname.split("/").toSpliced(1, 1).join("/");
    nav(`/${e.target.value}${pathWithoutLang}${loc.search}`);
  };
  return (
    <div className="w-[140px] flex justify-end">
      <select
        name="lang-select"
        onChange={handleChange}
        defaultValue={i18n.language || params.lang}
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
