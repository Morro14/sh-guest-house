import { Outlet } from "react-router";
export const serverURL = "http://127.0.0.1:8000/";
import axios from "axios";
import "../src/i18n/i18n";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

axios.defaults.withCredentials = true;
export const axiosInstance = axios.create({
	baseURL: serverURL,
	// timeout: 10000,
});

axios.interceptors.response.use((r) => {
	console.log("interseptor");
	const authExceptionsStatuses = [401, 403];
	if (authExceptionsStatuses.includes(r.status)) {
		// console.log(r);
		localStorage.removeItem("email");
	}
	// console.log("interseptor removing local data. response:", r);
	return r;
});

export default function App() {
	return (
		<>
			<Outlet />
		</>
	);
}
