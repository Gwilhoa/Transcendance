import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
const cookies = new Cookies();

export function setErrorCookie(ErrorMessage:string) {
	cookies.set('Error', ErrorMessage);	
}

function IfError() {
	const navigate = useNavigate();

	if (cookies.get('Error'))
		navigate('/Error');
	return (
		<>
		</>
	);
}

export default IfError;
