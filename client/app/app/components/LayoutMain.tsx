import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router";
import { ReactErrorBoundary } from "~/components/ErrorBoundary";
import { useLocation } from "react-router";

export default function LayoutMain() {
  const location = useLocation();
  return (
    <div className="min-h-screen">
      <ReactErrorBoundary key={location.pathname}>
        <Header></Header>
        <div className="flex flex-col justify-between min-h-full">
          <Outlet></Outlet>
          <Footer></Footer>
        </div>
      </ReactErrorBoundary>
    </div>
  );
}
