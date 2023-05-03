import React, { useState, useEffect } from "react";
import { useCookies, Cookies } from "react-cookie";
import axios from "axios";

function TokenPage() {
	const [accessToken, setAccessToken] = useState("");
	const [cookies, setCookie, removeCookie] = useCookies(['jwtAuthorization']);
	
	const setCookieJwt = (jwtToken: string) => {
		setCookie("jwtAuthorization", jwtToken, { maxAge: 2 * 60 * 60 });
	};

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
				setCookieJwt(response.data.access_token);
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
