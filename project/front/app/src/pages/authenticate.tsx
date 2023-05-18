import React, { useState, useEffect } from "react";
import { useCookies, Cookies } from "react-cookie";
import axios from "axios";
import TwoFa from "../components/AuthenticateComponentsTwoFa"
import NotTwoFa from "../components/AuthenticateComponentsNotTwoFa"
import Reconnect from "../components/Reconnect"
import IfError, { setErrorCookie } from "../components/IfError"
import { error } from "console";
import { Link, Navigate, useNavigate } from "react-router-dom";

export function TokenPage() {
	const [error, setError] = useState("");
	const [twoFa, setTwoFa] = useState(false);
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get("access_token");
	const navigate = useNavigate(); 

	useEffect(() => {
		axios.get("http://localhost:3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer `,
			},
		})
			.then((response) => {
				setTwoFa(response.data);
			})
			.catch((error) => {
				setError("Error " + error.response.status);
				setErrorCookie("Error TEST");
				navigate("/Error");

				console.error(error);
			});
		}, []);

	return (
		<div>
			{ error ? (<Reconnect />
			) : (
				<>
					{twoFa ? <TwoFa token={token}/> : <NotTwoFa token={token}/>}
				</>
			)}
			
		</div>
	);
}


export default TokenPage;
			// { error ? ( 
			// 	<Reconnect message={error} />
			// ) : (
			// 	<>
			// 		{twoFa && !error ? <TwoFa token={token}/> : <NotTwoFa token={token}/>}
			// 	</>
			// )}
