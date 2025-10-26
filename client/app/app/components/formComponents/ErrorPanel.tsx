import { useContextProvider } from "../ContextPorvider";
import { useRef, useEffect } from "react";
import { useNavigation, useActionData } from "react-router";

export default function ErrorPanel() {
	const pannelRef = useRef<HTMLDivElement>(null);
	const context = useContextProvider();
	useEffect(() => {
		context.setErrorState(context.errors);

		document.addEventListener("mousedown", () => {
			context.setErrorState(null);
		});
	}, [context.errors]);

	const errorsExist = context.errorState && context.errorState.length > 0;
	const style = errorsExist ? "h-7 flex" : "h-0 overflow-hidden";
	const errorMessage = errorsExist ? context.errorState[0] : "";
	return (
		<div
			ref={pannelRef}
			className={
				"absolute justify-center items-center w-full italic bg-red-bg-error-light font-sans transition-all duration-200 " +
				style
			}
		>
			{errorMessage.message}
		</div>
	);
}
