import { createTheme } from "@mui/material";
import { enUS, ruRU } from "@mui/x-date-pickers/locales";

export const datePickerTheme = createTheme({
  palette: {
    primary: {
      main: "#fb966e",
      light: "#fb966e",
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
      main: "#fb966e",
      light: "#fb966e",
      dark: "#fb966e",
      contrastText: "#fefdfc",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#4c3b33",
          fontFamily: `"Source Sans 3"`,
          backgroundColor: "#ffffff80",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: "#fb966e",
        },
      },
    },
  },
});

export const desktopDatePickerSx = {
  "& .MuiPickersInputBase-root::before": {
    borderColor: "#ba876f",
    display: "none",
  },
  "& .MuiPickersInputBase-root::after": {
    borderColor: "#efa76a",
    display: "none",
  },
  "& .MuiPickersInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before": {
    borderColor: "#764c38",
    border: "1px solid #fb966e",
  },
  "& .MuiPickersInputBase-root:hover:not(.Mui-disabled, .Mui-error)::after": {
    borderColor: "#764c38",
    border: "1px solid #fb966e",
  },
  "& .MuiPickersInputBase-root": {
    width: "142px",
    height: "28px",
    fontSize: "16px",
    paddingTop: "0px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#ffffff80",
  },
  "& .MuiPickersInputBase-sectionContent": {
    fontFamily: `"Source Sans 3"`,
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
