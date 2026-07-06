import { LANGUAGES } from "~/vars";
import { useLocation, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import langIcon from "src/assets/lang-change-icon.svg";

export default function LangSelect() {
  const { i18n } = useTranslation();
  const languageLabels = { en: "en", ru: "ru" };
  // const nav = useNavigate();
  const params = useParams();
  const loc = useLocation();
  const handleChange = (e) => {
    const pathWithoutLang = loc.pathname.split("/").toSpliced(1, 1).join("/");
    window.location.assign(`/${e.target.value}${pathWithoutLang}${loc.search}`);
  };
  return (
    <div className="w-35 flex justify-end items-center gap-2">
      <img src={langIcon} className="w-7 h-7" />
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
