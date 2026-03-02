import { createTheme } from "@mui/material";
import { enUS, ruRU } from "@mui/x-date-pickers/locales";

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
    "& .MuiPickersInputBase::hover": {
      styleOverrides: {
        root: {
          borderBottom: "1 solid",
          borderColor: "#4c3b33",
        },
      },
    },
  },
});

export const locales = {
  en: enUS,
  ru: ruRU,
};
