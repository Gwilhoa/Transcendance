import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AuthCode from 'react-auth-code-input';
import "../style/CreateTwoFa.css";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const CreateTwoFaPage = () => {
		 
	const [result, setResult] = useState<string>("");
	const [Error, setError] = useState<string>("");
	const handleOnChange = (res: string) => {
		setResult(res);
	};

	useEffect(() => {
		if (!result) {
			axios.get("http://localhost:3000/auth/2fa/create", {
				headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response);
					setResult(response.data);
				})
				.catch((error) => {
					setError("Error " + error.response.status);
					console.error("profil Error status " + error.response.status);
					console.error(error);
				});
		}
	}, []);

	return (
		<>
			<h1> TWOFA </h1>
			<img src={result} />
			<div>
				<AuthCode 
					allowedCharacters='numeric' 
					onChange={handleOnChange} 
					inputClassName='input'
				/>
			</div>
		</>

	);
}

export default CreateTwoFaPage;
