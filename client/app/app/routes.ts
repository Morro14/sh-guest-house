import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	layout("main.tsx", [index("routes/Main.tsx")]),
] satisfies RouteConfig;
