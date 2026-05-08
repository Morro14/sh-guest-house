import { useState } from "react";
import BookingPanelButton from "./BookingPanelButton";

export default function BookingPanelButtonTest() {
  const [navState, setNavState] = useState<"idle" | "submitting" | "loading">(
    "idle",
  );
  const changeTo = navState === "idle" ? "submitting" : "idle";
  return (
    <div onClick={() => setNavState(changeTo)}>
      <BookingPanelButton
        containerProps="w-50"
        state={navState}
        label={"Test"}
      ></BookingPanelButton>
    </div>
  );
}
