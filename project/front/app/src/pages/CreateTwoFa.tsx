import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import "./css/CreateTwoFa.css";
import Cookies from 'universal-cookie';
import ErrorToken, { setErrorLocalStorage } from '../components/IfError';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();

export const ErrorInput = () => {
		
	return (
	<p className='Error-msg'>*Bad input try again</p>
	);
}

const IsTwoFA = () => {
	const navigate = useNavigate();

	useEffect(() => { 
		axios.get(process.env.REACT_APP_IP + ":3000/auth/2fa/is2FA", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				if (response.data == true)
					navigate("/home");
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}, [navigate]);

	return (
		<>
		</>
	);
}


const CreateTwoFaPage = () => {
	const [, setResult] = useState<string>("");
	const [dataImage, setDataImage] = useState<string>("");
	const [Error, setError] = useState<boolean>(false);
	const navigate = useNavigate();
	const AuthInputRef = useRef<AuthCodeRef>(null);

	const handleOnChange = (res: string) => {
		setResult(res);
		if (res.length === 6) {
			console.log("result of input create 2fa " + res);
			axios.post(process.env.REACT_APP_IP + ":3000/auth/2fa/enable",
			{
				code: res
			},
			{
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response);
					navigate('/home');
				})
				.catch((error) => {
					if (error.response.status === 401) {
						setErrorLocalStorage("unauthorized");
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

	useEffect(() => {
			axios.get(process.env.REACT_APP_IP + ":3000/auth/2fa/create", {
				headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response);
					setDataImage(response.data);
				})
				.catch((error) => {
					console.error(error);
					setErrorLocalStorage("Error " + error.response.status);
					navigate('/Error');
				});
	}, [navigate]);

	return (
		<>
			<ErrorToken />
			<IsTwoFA />
				<h1 className='create-2FA-title'>
					Scan the qrCode and enter your Code
				</h1>
				<img src={dataImage} className="qrCode"/>
			<div className='input-2fa'>
				<AuthCode 
					allowedCharacters='numeric' 
					onChange={handleOnChange} 
					inputClassName='input'
					ref={AuthInputRef}
				/>
				{ Error == true ? (<ErrorInput />) : (<></>)}
			</div>
		</>

	);
}

export default CreateTwoFaPage;
