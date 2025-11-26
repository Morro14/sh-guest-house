import { createContext, useContext, useState } from "react";

export const BookingContext = createContext<any>({});

export default function ContextProvider({ children, params }) {
  const [select, setSelect] = useState({ adults: 2, children: 0 });
  const [displaySelect, setDisplaySelect] = useState(false);
  const [daysCount, setDaysCount] = useState(1);
  const errors = params.errors;
  const [errorState, setErrorState] = useState<null | Array<Object>>();
  const [formChange, setFormChange] = useState(false)
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
        errorState,
        setErrorState,
        formChange,
        setFormChange
      }}
    >
      {children}
    </BookingContext>
  );
}
export const useContextProvider = () => {
  return useContext(BookingContext);
};
