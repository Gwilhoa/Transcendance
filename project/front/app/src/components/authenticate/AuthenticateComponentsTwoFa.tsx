import React, { useState, useEffect, useRef } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import axios from "axios";
import { error } from "console";
import { useNavigate } from "react-router-dom";
import AuthCode, { AuthCodeRef } from "react-auth-code-input";
import { setErrorCookie } from "../IfError";
import { ErrorInput } from "../../pages/CreateTwoFa";
import "../../style/CreateTwoFa.css";

function AuthenticateComponentsTwoFa() {
	const [result, setResult] = useState<string>("");
	const [Error, setError] = useState<boolean>(false);
	const navigate = useNavigate();
	const AuthInputRef = useRef<AuthCodeRef>(null);

	const setCookieJwt = (jwtToken: string) => {
		cookies.set('jwtAuthorization', jwtToken, {sameSite: 'lax', maxAge: 2 * 60 * 60 });
	};

	const handleOnChange = (res: string) => {
		setResult(res);
		if (res.length === 6) {
			console.log("result of input create 2fa " + res);
			axios.post("http://localhost:3000/auth/authenticate", 
			{
				code: res
			},
			{
				headers: {
					Authorization: `Bearer ${cookies.get('tenMinToken')}`,
				},
			})
				.then((response) => {
					console.log(response);
					setCookieJwt(response.data.access_token);
					cookies.remove('tenMinToken');
					navigate('/Home');
				})
				.catch((error) => {
					if (error.response.status === 401) {
						setErrorCookie("unauthorized");
						navigate('/Error');
					}
					else {
						setError(true);
						console.error(error);
						AuthInputRef.current?.clear();
					}
				});
		}
		if (res.length === 2) {
			setError(false);
		}
	};



    return (
        <div>
			<p>TwoFa enable</p>
			<div>
				<AuthCode 
					allowedCharacters='numeric' 
					onChange={handleOnChange} 
					inputClassName='input'
					ref={AuthInputRef}
				/>
				{ Error == true ? (<ErrorInput />) : (<></>)}
			</div>
        </div>
    );
}

export default AuthenticateComponentsTwoFa;