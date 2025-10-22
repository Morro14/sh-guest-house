import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	index("routes/Main.tsx"),
	route("/booking", "routes/Booking.tsx"),
] satisfies RouteConfig;
