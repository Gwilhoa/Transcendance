import '../../pages/css/CreateTwoFa.css';
import React, {useEffect, useRef, useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import AuthCode, {AuthCodeRef} from 'react-auth-code-input';
import {setErrorLocalStorage} from '../IfError';
import {ErrorInput} from '../../pages/CreateTwoFa';

const cookies = new Cookies();

function AuthenticateComponentsTwoFa() {
	const [, setResult] = useState<string>('');
	const [Error, setError] = useState<boolean>(false);
	const navigate = useNavigate();
	const AuthInputRef = useRef<AuthCodeRef>(null);

	useEffect(() => {
		if (cookies.get('jwtAuthorization') != null) {
			axios.get(process.env.REACT_APP_IP + ':3000/auth/2fa/is2FA', {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then(() => {
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
	}, [navigate]);

	const setCookieJwt = (jwtToken: string) => {
		cookies.set('jwtAuthorization', jwtToken, {sameSite: 'none', maxAge: 2 * 60 * 60});
	};

	const handleOnChange = (res: string) => {
		setResult(res);
		if (res.length === 6) {
			console.log('result of input create 2fa ' + res);
			axios.post(process.env.REACT_APP_IP + ':3000/auth/authenticate',
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
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
					} else {
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
				{Error == true ? (<ErrorInput/>) : (<></>)}
			</div>
		</div>
	);
}

export default AuthenticateComponentsTwoFa;
