import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router";

export default function LayoutMain() {
  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex flex-col justify-between min-h-full">
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    </div>
  );
}
