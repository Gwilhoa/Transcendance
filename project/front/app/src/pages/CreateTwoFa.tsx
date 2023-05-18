import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AuthCode from 'react-auth-code-input';
import "../style/CreateTwoFa.css";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const CreateTwoFaPage = () => {
		 
	const [result, setResult] = useState<string>("");
	const [dataImage, setDataImage] = useState<string>("");
	const [Error, setError] = useState<string>("");
	const handleOnChange = (res: string) => {
		setResult(res);
	};

	useEffect(() => {
			axios.get("http://localhost:3000/auth/2fa/create", {
				headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response);
					setDataImage(response.data);
				})
				.catch((error) => {
					setError("Error " + error.response.status);
					console.error("profil Error status " + error.response.status);
					console.error(error);
				});
	}, []);

	return (
		<>
			<div className="qrCode">
				<h1>
					Scan the qrCode and enter your Code
				</h1>
				<img src={dataImage} />
			</div>
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
