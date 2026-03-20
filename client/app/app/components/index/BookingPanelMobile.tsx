import { Form } from "react-router";
import SelectGuestsMobile from "~/components/formComponents/SelectGuestsMobile";
import { useContextProvider } from "~/components/RequestAvailableRoomsContextProvider";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

export default function BookingPannelMobile() {
  const { t } = useTranslation();
  const context = useContextProvider();
  const formRef = useRef(null);
  const [formDisplay, setFormDisplay] = useState(false);
  const today = dayjs();
  const [date, setDate] = useState(today);
  const handleFormLabelClick = () => {
    setFormDisplay(!formDisplay);
  };
  return (
    <div className="md:hidden fixed bottom-0 z-30  w-full">
      <div
        className={`md:hidden w-screen bg-black  ${formDisplay ? "opacity-50 h-screen" : "opacity-0 h-0"} transition-opacity duration-500`}
      ></div>
      <div
        aria-disabled={formDisplay ? "true" : "false"}
        className={`flex flex-col ${formDisplay ? "bottom-0 opacity-100 flex" : "pointer-events-none opacity-0 -bottom-[330px]"} pb-10 absolute z-10 transition-all duration-500`}
      >
        <Form
          ref={formRef}
          method="post"
          className={`flex w-screen flex-col items-center overflow-visible bg-bg gap-6 py-6 font-sans text-text-main h-[336px]`}
        >
          <div className="flex flex-col items-center">
            <label className="font-light" htmlFor="checkin-date-input">
              {t("Check-in date") + ":"}
            </label>
            <DatePicker
              disablePast
              maxDate={today.set("year", today.get("year") + 1)}
              defaultValue={today}
              value={date}
              onChange={(date) => setDate(date)}
              slotProps={{
                textField: {
                  variant: "standard",
                  sx: {
                    "& .MuiPickersInputBase-root::before": {
                      borderBottom: "1px solid #d9d9d9",
                    },
                  },
                },
              }}
            ></DatePicker>
            <input
              readOnly
              name="date"
              className="hidden"
              id="checkin-date-input"
              value={date.format().slice(0, 10)}
            />
          </div>
          <SelectGuestsMobile />
          <div className="flex flex-col items-center">
            <label htmlFor="input-nights" className="font-light">
              {t("Nights")}
            </label>
            <div className="flex w-40 justify-center items-center hover:bg-apricot-light">
              <TextField
                error={context.errors?.nights ? true : false}
                name="nights"
                variant="standard"
                defaultValue={1}
                helperText={
                  context.errors?.nights ? context.errors.nights.message : ""
                }
              ></TextField>
            </div>
          </div>
          <button
            type="submit"
            className="font-medium underline mx-8 cursor-pointer"
          >
            {t("Continue")}
          </button>
        </Form>
      </div>
      <div className="relative bottom-0 flex justify-center z-100 items-center bg-peach-light size-full font-sans h-10">
        <div className="flex flex-col justify-center h-10 w-full">
          <button
            onClick={handleFormLabelClick}
            className={`order-2 block items-center capitalize font-normal px-9 cursor-pointer ${!formDisplay ? "text-lg" : "text-base"}`}
          >
            {!formDisplay ? t("book") : t("close")}
          </button>
        </div>
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
