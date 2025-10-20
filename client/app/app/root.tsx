import "~/styles/global.css";
import {
	Scripts,
	Links,
	ScrollRestoration,
	Outlet,
	type LoaderFunctionArgs,
} from "react-router";
export const serverURL = "http://127.0.0.1:8000/";
import axios from "axios";
import "root/src/i18n/i18n.ts";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({
	baseURL: serverURL,
	// timeout: 10000,
});

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					type="image/x-icon"
					href="/favicon.ico"
				/>

				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>

				<link
					rel="manifest"
					href="/site.webmanifest"
				/>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
export default function Root() {
	return (
		<>
			<Outlet />
		</>
	);
}
