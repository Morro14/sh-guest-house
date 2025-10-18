import {
	type RouteConfig,
	route,
	layout,
	index,
} from "@react-router/dev/routes";

export default [
	layout("main.tsx", [
		layout("routes/Main.tsx", [
			index("routes/Index.tsx"),
			route("oauth-success", "routes/OauthSuccess.tsx"),
		]),
	]),
] satisfies RouteConfig;
