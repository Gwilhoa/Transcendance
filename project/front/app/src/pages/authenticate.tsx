import React, { useState, useEffect } from "react";
import { useCookies, Cookies } from "react-cookie";
import axios from "axios";
import TwoFa from "../components/AuthenticateComponentsTwoFa"
import NotTwoFa from "../components/AuthenticateComponentsNotTwoFa"
import Reconnect from "../components/Reconnect"
import { error } from "console";
import { Link } from "react-router-dom";

export function TokenPage() {
	const [error, setError] = useState("");
	const [twoFa, setTwoFa] = useState(false);
	const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("access_token");

	useEffect(() => {
	axios.get("http://localhost:3000/auth/2fa/is2FA", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			setTwoFa(response.data);
			console.log(response.data);
		})
		.catch((error) => {
			setError("Error " + error.response.status);
			console.error("Error status " + error.response.status);
		});
	}, []);

	return (
		<div>
			{ error ? ( 
				<Reconnect message={error} />
			) : (
				<>
					{twoFa ? <TwoFa/> : <NotTwoFa/>}
				</>
			)}
		</div>
	);
}


export default TokenPage;
