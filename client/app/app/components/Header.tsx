import { Link } from "react-router";
import BookingPannel from "./Booking";
import { useTranslation } from "react-i18next";
import LangSelect from "./LangSelect";

const LOGOUT_URL = "auth/logout";

export default function Header() {
	const { t, i18n } = useTranslation();

	return (
		<header className="flex flex-col items-center h-[97px] w-screen bg-olive-light">
			<div className="flex justify-between items-center w-screen px-7 h-12">
				<div className="w-[96px]"></div>
				<div className="flex justify-between w-[306px] text-lg  underline font-sans">
					<Link
						to="contacts"
						className="w-[82px]"
					>
						{t("CONTACTS")}
					</Link>
					<Link
						to="contacts"
						className="w-[82px]"
					>
						LOCATION
					</Link>
					<Link
						to="contacts"
						className="w-[82px]"
					>
						ROOMS
					</Link>
				</div>
				<div className="flex items-center text-base font-sans gap-7">
					<div className="flex justify-center">
						<LangSelect></LangSelect>
					</div>
					<button
						// onClick={}
						className="cursor-pointer text-gray-2"
					>
						Login
						{/* {params.auth ? "Logout" : "Login"} */}
					</button>
				</div>
			</div>
			<BookingPannel></BookingPannel>
		</header>
	);
}
