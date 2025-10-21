import Header from "~/components/Header";
import ContextProvider from "~/components/ContextPorvider";

export default function Main() {
	return (
		<div className="flex flex-col min-h-screen min-w-screen text-text-main">
			<ContextProvider>
				<Header></Header>
				{/* <Index></Index> */}
			</ContextProvider>
		</div>
	);
}
