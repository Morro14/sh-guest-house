import { useState } from "react";
import { useFetchV3 } from "~/utils/fetchHook";

export default function RoomsPreview({ params }: any) {
	const { fetchedData, loading } = useFetchV3("rooms");
	const [room, setRoom] = useState();
	if (!loading) {
		console.log(fetchedData);
	}
	return (
		<div className="flex justify-between">
			<div></div>
		</div>
	);
}
