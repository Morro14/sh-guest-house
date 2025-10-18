import "~/styles/buttons.css";
import Login from "./Login";

const PROFILE_URL = "auth/profile";

export default function Index({ loaderData }: any) {
	return (
		<div className="flex grow flex-col items-center text-5xl text-gray-300 bg-gray-900 gap-8">
			<h1 className="mt-8">This is an Index page</h1>
			<Login></Login>
		</div>
	);
}
