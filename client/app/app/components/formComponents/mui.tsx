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
    MuiInputBase: {
      styleOverrides: {
        root: { color: "#4c3b33", fontFamily: "Source Sans 3" },
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
    MuiInputBase: {
      styleOverrides: {
        root: { color: "#4c3b33", fontFamily: "Source Sans 3" },
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
    paddingTop: "7px",
  },
  "& .MuiPickersInputBase-sectionContent": {
    fontFamily: "Source Sans 3",
    color: "#4c3b33",
    paddingBottom: "0",
  },
  "& .MuiPickersInputBase-sectionsContainer": {
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
