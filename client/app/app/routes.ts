import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  route(":lang?", "routes/Language.tsx", [
    layout("components/LayoutMain.tsx", [
      index("routes/IndexRoute.tsx"),
      route("booking", "routes/Booking.tsx", [
        index("routes/RequestInfo.tsx"),
        route("change-request-info", "routes/BookingForm.tsx"),
      ]),
      ...prefix("booking", [
        route("confirm", "routes/BookingSummary.tsx"),
        route("response", "routes/BookingConfirmResponse.tsx"),
      ]),
    ]),
    route("map", "routes/Map.tsx"),
  ]),
] satisfies RouteConfig;
