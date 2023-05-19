import React from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
const cookies = new Cookies();

export function setErrorCookie(ErrorMessage:string) {
	cookies.set('Error', ErrorMessage);	
}

function ErrorToken() {
	const navigate = useNavigate();

	if (cookies.get('jwtAuthorization') == null) {
		setErrorCookie('you\'r connexion time out');
		navigate('/Error');
	}
	return (
		<>
		</>
	);
}

export default ErrorToken;
