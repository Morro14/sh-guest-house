import Header from "~/components/Header";
import ContextProvider from "~/components/ContextPorvider";
import type { Route } from "./+types/Main";
import { validate } from "~/components/form_components/validate";
import { act } from "react";

export async function clientAction({ request }: Route.ClientActionArgs) {
	const formData = await request.formData();
	console.log(formData);
	const validations = validate(formData);
	const errors = validations.filter((v) => !v.valid);
	return errors;
}

export default function Main({ actionData }: Route.ComponentProps) {
	console.log("actionData", actionData);
	const errors = actionData;
	return (
		<div className="flex flex-col min-h-screen min-w-screen text-text-main">
			<ContextProvider params={{ errors: errors }}>
				<Header></Header>
				{/* <Index></Index> */}
			</ContextProvider>
		</div>
	);
}
