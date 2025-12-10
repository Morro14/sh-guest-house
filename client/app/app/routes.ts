import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/Main.tsx"),
  route("booking", "routes/Booking.tsx", [
    index("routes/RequestInfo.tsx"),
    route("form", "routes/BookingForm.tsx"),
  ]),
  ...prefix('booking', [
    route("confirm", "routes/BookingConfirm.tsx"),
  ])
] satisfies RouteConfig;
