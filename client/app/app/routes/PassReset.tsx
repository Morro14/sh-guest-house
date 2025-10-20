import { useState } from "react";
import serverURL from "~/root";
import axios from "axios";
import { Form } from "react-router";

export default function PassReset() {
	const [loading, setLoading] = useState(true);
	const [email, setEmail] = useState("");
	const url = serverURL + "auth/get-token";
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
