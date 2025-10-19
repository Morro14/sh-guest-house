export default function SelectGuests() {
	let options = ``;
	for (let i = 0; i < 14; i++) {
		options += <option>{}</option>;
	}

	return (
		<div className="">
			<select name="num-adults">{}</select>
			<select name="num-children"></select>
		</div>
	);
}
