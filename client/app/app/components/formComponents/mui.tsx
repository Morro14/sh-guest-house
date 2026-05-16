import { createTheme } from "@mui/material";
import { enUS, ruRU } from "@mui/x-date-pickers/locales";

export const datePickerTheme = createTheme({
  palette: {
    primary: {
      main: "#fb966e",
      light: "#F6A889",
      dark: "#fb966e",
      contrastText: "#ffffff",
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
        root: { color: "#4c3b33", fontFamily: `"Source Sans 3"` },
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
    borderColor: "#cccccc",
  },
  "& .MuiPickersInputBase-root::after": {
    borderColor: "#efa76a",
  },
  "& .MuiPickersInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before": {
    borderColor: "#764c38",
    borderBottom: "1px solid #efa76a",
  },
  "& .MuiPickersInputBase-root:hover:not(.Mui-disabled, .Mui-error)::after": {
    borderColor: "#764c38",
    borderBottom: "1px solid #efa76a",
  },
  "& .MuiPickersInputBase-root": {
    width: "142px",
    fontSize: "16px",
    paddingTop: "0px",
  },
  "& .MuiPickersInputBase-sectionContent": {
    fontFamily: `"Zen Kaku Gothic Antique"`,
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
