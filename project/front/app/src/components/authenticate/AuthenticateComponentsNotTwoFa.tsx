import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {setErrorLocalStorage} from '../IfError';

const cookies = new Cookies();

function AuthenticateComponentsNotTwoFa() {
	const navigate = useNavigate();
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		const url = process.env.REACT_APP_IP + ':3000/auth/authenticate';

		const setCookieJwt = (jwtToken: string) => {
			localStorage.setItem('jwtAuthorization', jwtToken);
		};

		if (localStorage.getItem('jwtAuthorization') != null) {
			axios.get(process.env.REACT_APP_IP + ':3000/auth/2fa/is2FA', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('jwtAuthorization')}`,
				},
			})
				.then(() => {
					setError(true);
					navigate('/home');
				})
				.catch((error) => {
					localStorage.removeItem('tenMinToken');
					setErrorLocalStorage('Error ' + error.response.status);
					console.error(error);
					navigate('/Error');
				});
		}

		if (error === false) {
			axios.post(url, {code: ''}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('tenMinToken')}`,
				},
			})
				.then((response) => {
					setCookieJwt(response.data.access_token);
					localStorage.removeItem('tenMinToken');
					navigate('/authenticate/waiting');
				})
				.catch((error) => {
					localStorage.removeItem('tenMinToken');
					setErrorLocalStorage('Error ' + error.response.status);
					console.error(error);
					navigate('/Error');
				});

		}
	}, [navigate, error]);

	return (
		<div>
			<p>Waiting ...</p>
		</div>
	);
}

export default AuthenticateComponentsNotTwoFa;
