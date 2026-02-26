import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router";
import { ReactErrorBoundary } from "~/components/ErrorBoundary";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import "dayjs/locale/ru";

export default function LayoutMain() {
  const { i18n } = useTranslation();
  return (
    <div className="min-h-screen">
      <ReactErrorBoundary>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={i18n.language}
        >
          <Header></Header>
          <div className="flex flex-col justify-between min-h-full">
            <Outlet></Outlet>
            <Footer></Footer>
          </div>
        </LocalizationProvider>
      </ReactErrorBoundary>
    </div>
  );
}
