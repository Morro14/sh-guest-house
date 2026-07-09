import { Form, useNavigation } from "react-router";
import SelectGuests from "~/components/formComponents/SelectGuests";
import { useIndexBookingContextProvider } from "~/components/booking/IndexBookingContextProvider";
import { useTranslation } from "react-i18next";
import ErrorPanel from "~/components/formComponents/ErrorPanel";
import dayjs from "dayjs";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "@mui/material";
import { desktopDatePickerTheme } from "../formComponents/mui.tsx";
import { desktopDatePickerSx } from "../formComponents/mui.tsx";
import { IndexFormLayout } from "../formComponents/SelectGuestsLayouts.tsx";
import BookingPanelButton from "./BookingPanelButton.tsx";
import { genGuestOptions } from "~/components/formComponents/utils.tsx";

export default function BookingPanel() {
  const today = dayjs();
  const [date, setDate] = useState(today);
  const { t } = useTranslation();
  const context = useIndexBookingContextProvider();
  const navigation = useNavigation();
  return (
    <div className="xl:flex sticky hidden top-0 bottom-0 z-30 w-full h-12 justify-center bg-[#ffffff99] backdrop-blur-xl drop-shadow">
      <div className={`size-full absolute bg-bg drop-shadow opacity-70`}></div>
      <div className="flex justify-center items-center size-full font-source-sans border-x border-accent-lighter">
        <Form
          method="post"
          className={`flex z-40 justify-center h-12 items-center overflow-visible gap-10`}
        >
          <div className="flex items-center text-nowrap text-ellipsis">
            {t("create_reservation")}
          </div>
          <div className="flex gap-7">
            <div className="">
              <ThemeProvider theme={desktopDatePickerTheme}>
                <DatePicker
                  maxDate={today.set("year", today.get("year") + 1)}
                  defaultValue={today}
                  value={date}
                  onChange={(date) => setDate(date)}
                  disablePast
                  slotProps={{
                    textField: {
                      "aria-label": "date",
                      fullWidth: false,
                      variant: "standard",
                      size: "small",
                      endAdornment: false,
                      // slotProps: {
                      //   disableUnderline: true,
                      // },
                      sx: desktopDatePickerSx,
                    },
                  }}
                ></DatePicker>
              </ThemeProvider>
              <input
                name="date"
                readOnly
                className="hidden"
                id="checkin-date-input"
                value={date.format().slice(0, 10)}
              />
            </div>

            <fieldset className="">
              <legend className="hidden text-gray-warm-mid text-sm">
                {t("Guests")}
              </legend>
              {/* <SelectGuests */}
              {/*   layout={FormChangeLayout} */}
              {/*   defaultParams={{ */}
              {/*     adults: searchParams.adults, */}
              {/*     children: searchParams.children, */}
              {/*   }} */}
              {/* /> */}
              <div className="flex h-full gap-7">
                <div className="flex items-center gap-2">
                  <label className="text-sm" htmlFor="select-adults">
                    {t("adults", { context: "genetive" })}
                  </label>
                  <select
                    id="select-adults"
                    defaultValue={2}
                    className="guest-input border border-line-light rounded px-1 h-[28px] bg-[#ffffff80]"
                    name="adults"
                  >
                    {genGuestOptions(12, "adults")}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm" htmlFor="select-children">
                    {t("children", { context: "genetive" })}
                  </label>
                  <select
                    id="select-children"
                    defaultValue={0}
                    className="guest-input border border-line-light rounded px-1 h-[28px] bg-[#ffffff80]"
                    name="children"
                  >
                    {genGuestOptions(12, "children")}
                  </select>
                </div>
              </div>
            </fieldset>

            <div className="flex gap-2 text-sm h-full justify-center items-center">
              <label htmlFor="nights-input" className="lowercase">
                {t("Nights", { count: context.nightsCount })}
              </label>
              <input
                className="peer text-center border w-9 border-line-light rounded h-[28px] bg-[#ffffff80]"
                name="nights"
                defaultValue={1}
                type="number"
                maxLength={2}
                id="nights-input"
                onChange={(e) => context.setNightsCount(Number(e.target.value))}
              />
            </div>
          </div>
          {/* <BookingPanelButtonTest></BookingPanelButtonTest> */}
          {/* <div className="flex flex-col items-center justify-center -mb-2"> */}
          {/*   <button type="submit" className="capitalize mx-8 cursor-pointer"> */}
          {/*     {t("Continue")} */}
          {/*   </button> */}
          {/* </div> */}
          <BookingPanelButton
            containerProps="w-30"
            state={navigation.state}
            label={t("Check availability")}
          ></BookingPanelButton>
          {/* <div className="relative -bottom-2 left-0 w-full">{underline}</div> */}
        </Form>
      </div>
      <div className="absolute top-10">
        <ErrorPanel errors={context.errors}></ErrorPanel>
      </div>
    </div>
  );
}
