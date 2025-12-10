import { createContext, useContext, useState } from "react";
import { getUrlSearchParams } from "~/utils/general";

export const BookingContext = createContext<any>({});

export default function ContextProvider({ children, params }) {
  const { adults: adultsDefault, children: childrenDedault } = getUrlSearchParams(['date', 'adults', 'children', 'days'])
  const [select, setSelect] = useState({ adults: Number(adultsDefault) || 2, children: Number(childrenDedault) || 0 });
  const [displaySelect, setDisplaySelect] = useState(false);
  const [daysCount, setDaysCount] = useState(1);
  const errors = params.errors;
  const [errorState, setErrorState] = useState<null | Array<Object>>(errors);
  const [formChange, setFormChange] = useState(false)
  const [blockClick, setBlockClick] = useState(false)
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
