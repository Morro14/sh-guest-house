import {
  createContext,
  useContext,
  useState,
  type SetStateAction,
} from "react";
import type { ValidationErrors } from "~/components/formComponents/validate";

type IndexBookingContext = {
  guestsSelect: { adults: number; children: number };
  setGuestsSelect: React.Dispatch<
    SetStateAction<{ adults: number; children: number }>
  >;
  displaySelect: boolean;
  setDisplaySelect: React.Dispatch<SetStateAction<boolean>>;
  nightsCount: number;
  setNightsCount: React.Dispatch<SetStateAction<number>>;
  errors: null | ValidationErrors;
  setErrors: React.Dispatch<SetStateAction<ValidationErrors>>;
  // errorState: null | ValidationErrors;
  // setErrorState: React.Dispatch<SetStateAction<null | ValidationErrors>>;
  formChange: boolean;
  setFormChange: React.Dispatch<SetStateAction<boolean>>;
  blockClick: boolean;
  setBlockClick: React.Dispatch<SetStateAction<boolean>>;
};
const IndexBookingContext = createContext<IndexBookingContext | null>(null);

export default function IndexBookingContextProvider({ children, params }) {
  const [guestsSelect, setGuestsSelect] = useState({ adults: 2, children: 0 });
  const [displaySelect, setDisplaySelect] = useState(false);
  const [nightsCount, setNightsCount] = useState(1);
  // const errors: ValidationErrors = params.errors;
  const [errors, setErrors] = useState(params.errors);
  // const [errorState, setErrorState] = useState<null | ValidationErrors>(errors);
  const [formChange, setFormChange] = useState(false);
  const [blockClick, setBlockClick] = useState(false);
  return (
    <IndexBookingContext
      value={{
        guestsSelect,
        setGuestsSelect,
        displaySelect,
        setDisplaySelect,
        nightsCount,
        setNightsCount,
        // errorState,
        // setErrorState,
        errors,
        setErrors,
        formChange,
        setFormChange,
        blockClick,
        setBlockClick,
      }}
    >
      {children}
    </IndexBookingContext>
  );
}
export const useIndexBookingContextProvider = () => {
  return useContext(IndexBookingContext);
};
