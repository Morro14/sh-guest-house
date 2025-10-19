import { axiosInstance } from "~/main.tsx";
const LOGOUT_URL = "auth/logout";
import { useState } from "react";
import { Link } from "react-router";
import langArrow from "root/src/assets/lang_arrow 1.svg";
import BookingPannel from "./Booking";
import { useTranslation } from "react-i18next";

export default function Header() {
	// const handleAuth = async () => {
	// 	if (params.auth) {
	// 		const response = await axiosInstance.get(LOGOUT_URL).then(() => {
	// 			params.setAuth(false);
	// 			localStorage.removeItem("username");
	// 		});
	// 		console.log(response);
	// 	}
	// };
	const { t, i18n } = useTranslation();
	// const testString = t("test");
	// console.log(testString);
	return (
		<header className="flex flex-col items-center h-[97px] w-screen bg-olive-light">
			<div className="flex justify-between items-center w-screen px-7 h-12">
				<div className="w-[96px]"></div>
				<div className="flex justify-between w-[306px] text-lg font-medium underline font-sans">
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
						<img
							src={langArrow}
							alt="lang-arrow-img"
						/>
						<div>EN</div>
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
