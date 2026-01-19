import { createContext, useContext, useState } from "react";

const BookingContext = createContext({});

export default function ContextProvider({ children, params }) {
  const [guestsSelect, setGuestsSelect] = useState({ adults: 2, children: 0 });
  const [displaySelect, setDisplaySelect] = useState(false);
  const [daysCount, setDaysCount] = useState(1);
  const errors = params.errors;
  const [errorState, setErrorState] = useState<null | Array<object>>(errors);
  const [formChange, setFormChange] = useState(false);
  const [blockClick, setBlockClick] = useState(false);
  return (
    <BookingContext
      value={{
        guestsSelect,
        setGuestsSelect,
        displaySelect,
        setDisplaySelect,
        daysCount,
        setDaysCount,
        errors,
        errorState,
        setErrorState,
        formChange,
        setFormChange,
        blockClick,
        setBlockClick,
      }}
    >
      {children}
    </BookingContext>
  );
}
export const useContextProvider = () => {
  return useContext(BookingContext);
};
