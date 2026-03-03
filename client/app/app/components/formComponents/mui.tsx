import { createTheme } from "@mui/material";
import { enUS, ruRU } from "@mui/x-date-pickers/locales";
import type { SxProps, Theme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const datePickerTheme = createTheme({
  palette: {
    primary: {
      main: "#efa76a",
      light: "#ffe5b6",
      dark: "#efa76a",
      contrastText: "#fefdfc",
    },
  },
  components: {
    MuiPickersInputBase: {
      styleOverrides: {
        root: { color: "#4c3b33" },
      },
    },
  },
});
export const desktopDatePickerTheme = createTheme({
  palette: {
    primary: {
      main: "#efa76a",
      light: "#ffe5b6",
      dark: "#efa76a",
      contrastText: "#fefdfc",
    },
  },
  components: {
    MuiPickersInputBase: {
      styleOverrides: {
        root: { color: "#4c3b33" },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: "#764c38",
        },
      },
    },
  },
});

export const desktopDatePickerSx = {
  "& .MuiPickersInputBase-root::before": {
    borderColor: "#ba876f",
  },
  "& .MuiPickersInputBase-root::after": {
    borderColor: "#ba876f",
  },
  "& .MuiPickersInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before": {
    borderColor: "#764c38",
    borderBottom: "1px solid #764c38",
  },
  "& .MuiPickersInputBase-root:hover:not(.Mui-disabled, .Mui-error)::after": {
    borderColor: "#764c38",
    borderBottom: "1px solid #764c38",
  },
  "& .MuiPickersInputBase-root": {
    width: "142px",
    fontSize: "16px",
    paddingTop: "2px",
  },
  "& .MuiPickersInputBase-sectionContent": {
    fontFamily: '"Source Sans 3"',
    paddingBottom: "0",
  },
  "& .MuiPickersInputBase-sectionsContainer": {
    padding: "0 6px 0",
  },
  "& .MuiIconButton-root": {
    scale: "90%",
    padding: "0 6px 0",
  },
  "& .MuiIconButton-root": {
    scale: "90%",
    padding: "0 6px 0",
  },
  "& .MuiIconButton-root:hover": {
    backgroundColor: "#ffe5b6",
  },
};

export const locales = {
  en: enUS,
  ru: ruRU,
};
