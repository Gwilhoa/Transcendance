import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import axios from "axios";
import { cookies } from "../App";

export function setErrorCookie(ErrorMessage:string) {
	cookies.set('Error', ErrorMessage);	
}

function ErrorToken() {
	const navigate = useNavigate();

	useEffect(() => { 
	if (cookies.get('jwtAuthorization') == null) {
		setErrorCookie('you\'r connexion time out');
		navigate('/Error');
	}

		axios.get("http://localhost:3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}, []);

	return (
		<>
		</>
	);
}

export default ErrorToken;
