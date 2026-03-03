import { Form } from "react-router";
import SelectGuests from "~/components/formComponents/SelectGuests";
import { useContextProvider } from "~/components/RequestAvailableRoomsContextProvider";
import { useTranslation } from "react-i18next";
import ErrorPanel from "~/components/formComponents/ErrorPanel";
import dayjs from "dayjs";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "@mui/material";
import { desktopDatePickerTheme } from "../formComponents/mui.tsx";
import { desktopDatePickerSx } from "../formComponents/mui.tsx";
import { IndexFormLayout } from "../formComponents/SelectGuestsLayouts.tsx";

export default function BookingPannel() {
  const today = dayjs();
  const [date, setDate] = useState(today);
  const { t } = useTranslation();
  const context = useContextProvider();
  return (
    <div className="md:flex sticky hidden top-0 bottom-0 z-30 w-full drop-shadow-md h-10">
      <div className="flex justify-center items-center bg-peach-light size-full font-sans">
        <Form
          method="post"
          className={`flex justify-center h-10 items-center overflow-visible bg-peach-light`}
        >
          <div className="flex items-center font-normal px-8 h-10 pt-0.5">
            {t("create_reservation")}
          </div>
          <div className="w-[1px] bg-accent-light h-8"></div>
          <div className="px-4">
            <ThemeProvider theme={desktopDatePickerTheme}>
              <DatePicker
                maxDate={today.set("year", today.get("year") + 1)}
                defaultValue={today}
                value={date}
                onChange={(date) => setDate(date)}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: false,
                    variant: "standard",
                    size: "small",
                    endAdornment: false,
                    InputProps: {
                      disableUnderline: true,
                    },
                    sx: desktopDatePickerSx,
                  },
                }}
              ></DatePicker>
            </ThemeProvider>
            <input
              name="date"
              className="hidden"
              id="checkin-date-input"
              value={date.format().slice(0, 10)}
            />
          </div>

          <div className="w-[1px] bg-accent-light h-8"></div>

          <SelectGuests layout={IndexFormLayout} />

          <div className="w-[1px] bg-accent-light h-8"></div>

          <div className="flex h-10 w-[160px] justify-center items-center hover:bg-apricot-light transition-colors duration-100">
            <input
              className="peer text-center pt-0.5 border-b w-6 -ml-6 focus:bg-apricot border-accent-light"
              name="nights"
              defaultValue={1}
              type="text"
              maxLength={2}
              id="nights-input"
              onChange={(e) => context.setNightsCount(Number(e.target.value))}
            />
            <label
              htmlFor="nights-input"
              className="w-[25px] ml-2 pt-0.5 lowercase"
            >
              {t("Nights", { count: context.nightsCount })}
            </label>
          </div>

          <div className="w-[1px] bg-accent-light h-8"></div>
          <button
            type="submit"
            className=" uppercase mx-8 cursor-pointer pt-0.5"
          >
            {t("Continue")}
          </button>
        </Form>
      </div>
      <ErrorPanel></ErrorPanel>
    </div>
  );
}
