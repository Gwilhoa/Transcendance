import React, { useState, useEffect } from "react";
import { useCookies, Cookies } from "react-cookie";
import Reconnect from "../components/Reconnect";
import axios from "axios";
import { error } from "console";
import { Navigate } from "react-router-dom";

function AuthenticateComponentsNotTwoFa() {
	const [error, setError] = useState("");
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
				setError("Error " + error.response.status);
				console.error("Error status " + error.response.status);
            });
	}, []);
    return (
        <div>
			{ error ? (
				<Reconnect message={error}/>
				) : (
					<p>Waiting ...</p>
			)}
			<Navigate to="/accueil" />
        </div>
    );
}

export default AuthenticateComponentsNotTwoFa;
