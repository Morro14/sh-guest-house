import { createContext, useContext, useState } from "react";
import type { ValidationErrors } from "./formComponents/validate";

const BookingContext = createContext({});

export default function ContextProvider({ children, params }) {
  const [guestsSelect, setGuestsSelect] = useState({ adults: 2, children: 0 });
  const [displaySelect, setDisplaySelect] = useState(false);
  const [nightsCount, setNightsCount] = useState(1);
  const errors: ValidationErrors = params.errors;
  const [errorState, setErrorState] = useState<null | ValidationErrors>(errors);
  const [formChange, setFormChange] = useState(false);
  const [blockClick, setBlockClick] = useState(false);
  return (
    <BookingContext
      value={{
        guestsSelect,
        setGuestsSelect,
        displaySelect,
        setDisplaySelect,
        nightsCount,
        setNightsCount,
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
