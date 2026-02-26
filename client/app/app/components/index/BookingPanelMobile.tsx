import { Form, useSubmit } from "react-router";
import SelectGuestsMobile from "~/components/formComponents/SelectGuestsMobile";
import { useContextProvider } from "~/components/RequestAvailableRoomsContextProvider";
import { useTranslation } from "react-i18next";
import ErrorPanel from "~/components/formComponents/ErrorPanel";
import { useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import { datePickerTheme } from "../formComponents/utils";

export default function BookingPannelMobile() {
  const { t } = useTranslation();
  const context = useContextProvider();
  const submit = useSubmit();
  const formRef = useRef(null);
  const [formDisplay, setFormDisplay] = useState(false);
  const [dateValue, setDateValue] = useState(dayjs());
  const handleFormLabelClick = () => {
    if (formDisplay && formRef.current) {
      submit(formRef.current, { method: "post" });
    } else {
      setFormDisplay(true);
    }
  };
  return (
    <div className="md:hidden fixed bottom-0 z-30 inline-block w-full drop-shadow-md h-10">
      <div className="absolute top-10">
        <ErrorPanel></ErrorPanel>
      </div>
      <div className="flex justify-center items-center bg-peach-light size-full font-sans">
        <div className="flex flex-col relative justify-center h-10">
          <button
            onClick={handleFormLabelClick}
            className="order-2 block items-center font-normal px-9"
          >
            {!formDisplay ? t("create_reservation") : t("book")}
          </button>
          <Form
            ref={formRef}
            method="post"
            className={`absolute bottom-10 ${formDisplay ? "flex" : "hidden"} flex-col  items-center overflow-visible bg-bg gap-6 py-6`}
          >
            <ThemeProvider theme={datePickerTheme}>
              <DatePicker
                value={dateValue}
                onChange={(v) => setDateValue(v)}
                defaultValue={dayjs()}
              ></DatePicker>
            </ThemeProvider>
            <input
              name="date"
              value={dateValue.toISOString().slice(0, 10)}
              className="hidden"
            />

            <SelectGuestsMobile />
            <div className="flex flex-col items-center">
              <label htmlFor="input-nights" className="text-sm">
                Nights:
              </label>
              <div className="flex w-40 justify-center items-center hover:bg-apricot-light">
                <input
                  id="input-nights"
                  className="text-center font-medium w-12 focus:bg-peach-lighter border-b border-line-light"
                  name="nights"
                  defaultValue={1}
                  type="text"
                  maxLength={2}
                  onChange={(e) =>
                    context.setNightsCount(Number(e.target.value))
                  }
                />
              </div>
            </div>
          </Form>
        </div>
        <button
          className={`cursor-pointer ${formDisplay ? "block" : "hidden"}`}
          onClick={() => setFormDisplay(false)}
        >
          {closeCross}
        </button>
      </div>
    </div>
  );
}

const closeCross = (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="0.707107"
      y1="0.707078"
      x2="19.7071"
      y2="19.7071"
      stroke="#4C3B33"
      stroke-width="2"
    />
    <line
      x1="19.7071"
      y1="1.12129"
      x2="0.707107"
      y2="20.1213"
      stroke="#4C3B33"
      stroke-width="2"
    />
  </svg>
);
