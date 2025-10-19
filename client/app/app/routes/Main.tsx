import { Outlet } from "react-router";
import Header from "~/components/Header";
import Index from "./Index";

export default function Main() {
	return (
		<div className="flex flex-col min-h-screen min-w-screen text-text-main">
			<Header></Header>
			{/* <Index></Index> */}
		</div>
	);
}
