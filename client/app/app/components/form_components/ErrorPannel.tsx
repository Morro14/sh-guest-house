import { useContextProvider } from "../ContextPorvider";

export default function ErrorPannel() {
	const context = useContextProvider();
	const errorsExist = context.errors && context.errors.length > 0;
	const style = errorsExist ? "h-7 flex" : "h-0 overflow-hidden";
	const errorMessage = errorsExist ? context.errors[0] : "";
	console.log("error pannel", context.errors);
	return (
		<div
			className={
				"absolute justify-center items-center w-full italic bg-red-bg-error font-sans text-sm transition-all duration-200 " +
				style
			}
		>
			{errorMessage.message}
		</div>
	);
}
