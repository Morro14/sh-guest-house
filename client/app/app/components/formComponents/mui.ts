import { createTheme } from "@mui/material";
import { enUS, ruRU } from "@mui/x-date-pickers/locales";

export const datePickerTheme = createTheme({
  palette: {
    primary: {
      main: "#efa76a",
      light: "#f6c18d",
      dark: "#ffe5b6",
      contrastText: "#4c3b33",
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

export const locales = {
  en: enUS,
  ru: ruRU,
};
