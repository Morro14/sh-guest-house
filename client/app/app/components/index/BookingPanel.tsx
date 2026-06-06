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

export default function BookingPanel() {
  const today = dayjs();
  const [date, setDate] = useState(today);
  const { t } = useTranslation();
  const context = useIndexBookingContextProvider();
  const navigation = useNavigation();
  return (
    <div className="xl:flex sticky hidden top-0 bottom-0 z-30 w-full h-12 justify-center">
      {/* <div className="absolute w-full h-24 blur-lg bg-linear-to-b from-bg to-[#00000000]"></div> */}
      <div
        className={`size-full absolute bg-bg drop-shadow ${navigation.state === "submitting" ? "" : ""} transition-colors duration-300`}
      ></div>
      <div className="flex justify-center items-center size-full font-source-sans border-x border-accent-lighter">
        <Form
          method="post"
          className={`flex z-40 justify-center h-12 items-center overflow-visible `}
        >
          <div className="flex items-center text-nowrap text-ellipsis pr-8 pl-2">
            {t("create_reservation")}
          </div>
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
              readOnly
              className="hidden"
              id="checkin-date-input"
              value={date.format().slice(0, 10)}
            />
          </div>

          <SelectGuests layout={IndexFormLayout} />

          <div className="flex h-full w-40 justify-center items-center">
            <input
              className="peer text-center border-b w-6 -ml-6 border-accent-light"
              name="nights"
              defaultValue={1}
              type="text"
              maxLength={2}
              id="nights-input"
              onChange={(e) => context.setNightsCount(Number(e.target.value))}
            />
            <label htmlFor="nights-input" className="ml-2 lowercase">
              {t("Nights", { count: context.nightsCount })}
            </label>
          </div>
          {/* <BookingPanelButtonTest></BookingPanelButtonTest> */}
          {/* <div className="flex flex-col items-center justify-center -mb-2"> */}
          {/*   <button type="submit" className="capitalize mx-8 cursor-pointer"> */}
          {/*     {t("Continue")} */}
          {/*   </button> */}
          {/* </div> */}
          <div className="relative w-auto flex flex-col">
            <BookingPanelButton
              containerProps=""
              state={navigation.state}
              label={t("Check availability")}
            ></BookingPanelButton>
            {/* <div className="relative -bottom-2 left-0 w-full">{underline}</div> */}
          </div>
        </Form>
      </div>
      <div className="absolute top-10">
        <ErrorPanel errors={context.errors}></ErrorPanel>
      </div>
    </div>
  );
}

const underline = (
  <svg
    width="136"
    height="6"
    viewBox="0 0 136 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_g_2001_76)">
      <path
        d="M0.86969 3.62521C52.4697 1.22521 111.703 2.62521 134.87 3.62521"
        stroke="#FBB396"
        strokeWidth="3"
      />
    </g>
    <defs>
      <filter
        id="filter0_g_2001_76"
        x="-1.2219e-05"
        y="4.88162e-05"
        width="135.734"
        height="5.92373"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.26315790414810181 0.26315790414810181"
          numOctaves="3"
          seed="3261"
        />
        <feDisplacementMap
          in="shape"
          scale="1.6000000238418579"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedImage"
          width="100%"
          height="100%"
        />
        <feMerge result="effect1_texture_2001_76">
          <feMergeNode in="displacedImage" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);
