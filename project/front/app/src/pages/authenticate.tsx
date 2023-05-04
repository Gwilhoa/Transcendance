import React, { useState, useEffect } from "react";
import { useCookies, Cookies } from "react-cookie";
import axios from "axios";
import { getJwt } from "../API"
import { error } from "console";


export var bigToken:string;

export function TokenPage() {
	const [accessToken, setAccessToken] = useState("");
	const [twoFa, setTwoFa] = useState(true);
	const [cookies, setCookie, removeCookie] = useCookies(['jwtAuthorization']);
	
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get("access_token");
		const url = "http://localhost:3000/auth/authenticate";

		const setCookieJwt = (jwtToken: string) => {
			setCookie("jwtAuthorization", jwtToken, { maxAge: 2 * 60 * 60 });
		};
		console.log(token);

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
				console.error(error);
			});

		axios.get(url, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				bigToken = response.data.access_token;
				setAccessToken(response.data.access_token);
				setCookieJwt(response.data.access_token);
			})
			.catch((error) => {
				console.error(error);
			});
		// setCookie("jwtAuthorization", getJwt(url, token), { maxAge: 2 * 60 * 60 });

	}, []);
	return (
		<div>
			<p>{accessToken}</p>
		</div>
	);
}


export default TokenPage;
