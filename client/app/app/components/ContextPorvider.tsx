import { createContext, useContext } from "react";
import { useState } from "react";

export const BookingContext = createContext<any>({});

export default function ContextProvider({ children, params }) {
	const [select, setSelect] = useState({ adults: 2, children: 0 });
	const [displaySelect, setDisplaySelect] = useState(false);
	const [daysCount, setDaysCount] = useState(1);
	const errors = params.errors;
	// const [errors, setErrors] = useState();
	return (
		<BookingContext
			value={{
				select,
				setSelect,
				displaySelect,
				setDisplaySelect,
				daysCount,
				setDaysCount,
				errors,
			}}
		>
			{children}
		</BookingContext>
	);
}
export const useContextProvider = () => {
	return useContext(BookingContext);
};
