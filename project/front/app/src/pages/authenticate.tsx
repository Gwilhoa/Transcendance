import React from 'react';
import axios from 'axios';
import {setErrorLocalStorage} from '../components/IfError'
import {useNavigate} from 'react-router-dom';

export function TokenPage() {
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('access_token');
	if (token != null) {
		localStorage.setItem('tenMinToken', token);
	}
	const navigate = useNavigate();

	axios.get(process.env.REACT_APP_IP + ':3000/auth/2fa/is2FA', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			if (response.data == false)
				navigate('/authenticate/NotTwoFa');
			else
				navigate('/authenticate/TwoFa');
		})
		.catch((error) => {
			setErrorLocalStorage('Error ' + error.response.status);
			console.error(error);
			navigate('/Error');
		});

	return (
		<>
		</>
	);
}

export default TokenPage;
