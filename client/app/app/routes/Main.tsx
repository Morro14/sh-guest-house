import { Outlet } from "react-router";

export default function Main() {
	return (
		<div className="flex flex-col min-h-screen min-w-screen">
			{/* <Header></Header> */}
			<Outlet></Outlet>
		</div>
	);
}
