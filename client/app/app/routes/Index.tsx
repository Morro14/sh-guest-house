import "~/styles/buttons.css";
import Login from "./Login";
import { useTranslation } from "react-i18next";

const PROFILE_URL = "auth/profile";

export default function Index({ loaderData }: any) {
	const { t, i18n } = useTranslation();
	return (
		<div className="flex grow flex-col items-center text-5xl text-gray-300 bg-gray-900 gap-8">
			<h1 className="mt-8">This is an Index page</h1>
			<h1>{t("welcome")}</h1>
			<button onClick={() => i18n.changeLanguage("ru")}>Русский</button>
			<button onClick={() => i18n.changeLanguage("en")}>English</button>
			{/* <Login></Login> */}
		</div>
	);
}
