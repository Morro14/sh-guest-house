import { useState } from "react";
import { Form } from "react-router";

export default function PassReset() {
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");

	// Form

	return (
		<>
			<h3>
				To reset your password please enter your email address that you
				previously used to sign in.
			</h3>
			<div>
				<Form>
					<input
						type="text"
						placeholder="email"
					/>
				</Form>
			</div>
		</>
	);
}
