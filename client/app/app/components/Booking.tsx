import { Form } from "react-router";

export default function BookingPannel() {
	return (
		<div className="flex justify-center items-center bg-peach-light h-10 w-full font-sans">
			<Form className="flex justify-center items-center gap-8">
				<div className="w-[1px] bg-line h-8"></div>
				<div className="font-medium">BOOK NOW</div>
				<div className="w-[1px] bg-line h-8"></div>
				<input
					name="date"
					type="date"
					placeholder="Date"
				/>
				<div className="w-[1px] bg-line h-8"></div>
				<input
					name="persons"
					type="text"
					placeholder="Number of guests"
				/>
				<div className="w-[1px] bg-line h-8"></div>
				<input
					name="days"
					type="text"
					placeholder="Days"
				/>
				<div className="w-[1px] bg-line h-8"></div>
				<button
					type="submit"
					className="font-medium underline"
				>
					CHECK
				</button>
				<div className="w-[1px] bg-line h-8"></div>
			</Form>
		</div>
	);
}
