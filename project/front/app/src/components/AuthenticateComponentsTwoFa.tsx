import React, { useState, useEffect } from "react";
import { useCookies, Cookies } from "react-cookie";
import axios from "axios";
import { error } from "console";

interface tokenProps {
    token: string | null,
}

function AuthenticateComponentsTwoFa({ token }: tokenProps) {
	const [accessToken, setAccessToken] = useState("");
	const [twoFa, setTwoFa] = useState(true);
	const [cookies, setCookie, removeCookie] = useCookies(['jwtAuthorization']);
	
	useEffect(() => {
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
                console.error(error);
            });
	}, []);
    return (
        <div>
			<p>TwoFa enable</p>
        </div>
    );
}

export default AuthenticateComponentsTwoFa;
