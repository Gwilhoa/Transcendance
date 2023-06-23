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
			cookies.set('jwtAuthorization', jwtToken, {sameSite: 'lax', maxAge: 2 * 60 * 60});
		};

		if (cookies.get('jwtAuthorization') != null) {
			axios.get(process.env.REACT_APP_IP + ':3000/auth/2fa/is2FA', {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then(() => {
					setError(true);
					cookies.remove('Error');
					navigate('/home');
				})
				.catch((error) => {
					cookies.remove('tenMinToken');
					setErrorLocalStorage('Error ' + error.response.status);
					console.error(error);
					navigate('/Error');
				});
		}

		if (error === false) {
			axios.post(url, {code: ''}, {
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
					setErrorLocalStorage('Error ' + error.response.status);
					console.error(error);
					navigate('/Error');
				});
			axios.get(process.env.REACT_APP_IP + ':3000/user/id', {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log('localstorage set : id :')
					console.log(response.data.id);
					console.log('id set in localstorage');
					localStorage.setItem('id', response.data.id);
					console.log(localStorage.getItem('id'))
				})
				.catch((error) => {
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