import React, { useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AuthenticateComponentsNotTwoFa() {
	const navigate = useNavigate();

	useEffect(() => {
        const url = "http://localhost:3000/auth/authenticate";

        const setCookieJwt = (jwtToken: string) => {
			cookies.set('jwtAuthorization', jwtToken, {sameSite: 'lax', maxAge: 2 * 60 * 60 });
        };

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${cookies.get('tenMinToken')}`,
            },
        })
            .then((response) => {
                setCookieJwt(response.data.access_token);
				cookies.remove('tenMinToken');
				navigate('/accueil');
            })
            .catch((error) => {
				console.error("Error status " + error.response.status);
				console.error(error);
            });
	}, []);
    return (
        <div>
			<p>Waiting ...</p>
        </div>
    );
}

export default AuthenticateComponentsNotTwoFa;
