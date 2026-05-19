import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router";
import { ReactErrorBoundary } from "~/components/ErrorBoundary";
import { ThemeProvider } from "@emotion/react";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { datePickerTheme, locales } from "./formComponents/mui.tsx";
import "dayjs/locale/ru";
import i18n from "root/src/i18n/i18n";

export default function LayoutMain() {
  return (
    <div className="min-h-screen text-text-main">
      <ReactErrorBoundary>
        <ThemeProvider theme={datePickerTheme}>
          <LocalizationProvider
            adapterLocale={i18n.language}
            dateAdapter={AdapterDayjs}
            localeText={
              locales[i18n.language].components.MuiLocalizationProvider
                .defaultProps.localeText
            }
          >
            <Header></Header>
            <div className="flex flex-col justify-between min-h-full">
              <Outlet></Outlet>
              <Footer></Footer>
            </div>
          </LocalizationProvider>
        </ThemeProvider>
      </ReactErrorBoundary>
    </div>
  );
}
