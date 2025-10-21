import { createContext, useContext } from "react";
import { useState } from "react";

export const BookingContext = createContext<any>({});

export default function ContextProvider({ children }) {
	const [select, setSelect] = useState({ adults: 2, children: 0 });
	const [displaySelect, setDisplaySelect] = useState(false);
	const [daysCount, setDaysCount] = useState(1);
	return (
		<BookingContext
			value={{
				select,
				setSelect,
				displaySelect,
				setDisplaySelect,
				daysCount,
				setDaysCount,
			}}
		>
			{children}
		</BookingContext>
	);
}
export const useContextProvider = () => {
	return useContext(BookingContext);
};
