import Header from "~/components/Header";
import ContextProvider from "~/components/ContextPorvider";
import type { Route } from "./+types/Main";
import { validate } from "~/components/formComponents/validate";
import { axiosInstance } from "~/root";
import Index from "./Index";

const BOOKING_URL = "booking";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	const validations = validate(formData);
	const errors = validations.filter((v) => !v.valid);
	if (errors.length > 0) {
		return errors;
	}
	const response = await axiosInstance({
		method: "post",
		url: BOOKING_URL,
		data: formData,
	});
	console.log("booking response:", response);
}

export default function Main({ actionData }: Route.ComponentProps) {
	const errors = actionData;
	return (
		<div className="flex flex-col min-h-screen min-w-screen text-text-main">
			<ContextProvider params={{ errors: errors }}>
				<Header></Header>
				<Index></Index>
			</ContextProvider>
		</div>
	);
}
