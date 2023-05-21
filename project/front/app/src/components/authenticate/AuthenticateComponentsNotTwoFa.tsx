import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setErrorCookie } from "../IfError";

function AuthenticateComponentsNotTwoFa() {
	const navigate = useNavigate();
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
			const url = "http://localhost:3000/auth/authenticate";

			const setCookieJwt = (jwtToken: string) => {
				cookies.set('jwtAuthorization', jwtToken, {sameSite: 'lax', maxAge: 2 * 60 * 60 });
			};

		axios.get("http://localhost:3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then(() => {
				setError(true);
				cookies.remove('Error');
				navigate('/home');
			});
			
			if (error === false) {
			axios.post(url, {code: ""},{
				headers: {
					Authorization: `Bearer ${cookies.get('tenMinToken')}`,
				},
			})
				.then((response) => {
					setCookieJwt(response.data.access_token);
					cookies.remove('tenMinToken');
					navigate('/home');
				})
				.catch((error) => {
					cookies.remove('tenMinToken');
					setErrorCookie("Error " + error.response.status);
					console.error(error);
					navigate('/Error');
				});
			}
	}, []);
    return (
        <div>
			<p>Waiting ...</p>
        </div>
    );
}

export default AuthenticateComponentsNotTwoFa;
