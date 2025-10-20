import { useTranslation } from "react-i18next";
import { Form } from "react-router";

export default function LangSelect() {
	const { t, i18n } = useTranslation();
	const languages = [
		{ code: "en", label: "English" },
		{ code: "ru", label: "Русский" },
	];

	return (
		<div>
			<Form>
				<select
					name="lang-select"
					defaultValue={i18n.language}
					onChange={(e) => i18n.changeLanguage(e.target.value)}
				>
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
			</Form>
		</div>
	);
}
