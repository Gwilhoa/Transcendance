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

		axios.get(process.env.REACT_APP_IP + ":3000/user/id", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				if (cookies.get('jwtAuthorization') != null)
					cookies.remove('jwtAuthorization');
				navigate('/Error');
			});
	}, [navigate]);

	return (
		<>
		</>
	);
}

export default ErrorToken;
