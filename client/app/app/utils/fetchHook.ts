import { useState, useEffect } from "react";
import { axiosInstance } from "~/root";

export function useFetchV3(url: string, valid = true, timeout = 0) {
	const [loading, setLoading] = useState(true);
	const [fetchedData, setFetchedData] = useState(undefined);

	useEffect(() => {
		if (!valid) {
			setLoading(false);
			return;
		}
		if (!loading) {
			return;
		}

		axiosInstance
			.get(url, { timeout: timeout })
			.then((r) => {
				setFetchedData({ data: r.data, status: r.status, message: "success" });

				setLoading(false);
			})
			.catch((r) => {
				setFetchedData({ data: r.data, status: r.status, message: r.message });
				setLoading(false);
			});
	}, [url]);
	return { validParams: valid, fetchedData, loading };
}
