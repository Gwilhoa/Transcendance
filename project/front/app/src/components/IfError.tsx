import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cookies } from "../App";

export function setErrorLocalStorage(ErrorMessage:string) {
	localStorage.setItem('Error', ErrorMessage);
	localStorage.removeItem('id');
}

function ErrorToken() {
	const navigate = useNavigate();

	useEffect(() => { 
	if (cookies.get('jwtAuthorization') == null) {
		setErrorLocalStorage('you\'r connexion time out');
		navigate('/Error');
	}

		axios.get("http://localhost:3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}, [navigate]);

	return (
		<>
		</>
	);
}

export default ErrorToken;
