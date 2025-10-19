import { useTranslation } from "react-i18next";

export default function LangSelect() {
	const { t, i18n } = useTranslation();
	const languages = [
		{ code: "en", label: "English" },
		{ code: "ru", label: "Русский" },
	];
	const handleChange = (e: any) => {
		const lang = e.target.value;
		i18n.changeLanguage(lang);
	};
	return (
		<div>
			<select onChange={handleChange}>
				{languages.map((lang) => {
					return (
						<option
							key={"opt-lang-" + lang.code}
							value={lang.code}
						>
							{lang.label}
						</option>
					);
				})}
			</select>
		</div>
	);
}
