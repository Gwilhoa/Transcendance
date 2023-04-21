import React, { useState, useEffect } from "react";
import axios from "axios";

function TokenPage() {
	const [accessToken, setAccessToken] = useState("");

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("access_token");
		const url = "http://localhost:3000/auth/authenticate";

		axios.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				setAccessToken(response.data.access_token);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div>
			<p>{accessToken}</p>
		</div>
	);
}

export default TokenPage;
