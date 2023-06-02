import axios from 'axios';
import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Auth() {
	const navigate = useNavigate();

	localStorage.removeItem('Error');
	localStorage.removeItem('id');
	useEffect(() => {
	const myVariable = process.env.REACT_APP_IP;
	console.log(myVariable + " what is this");
		if (cookies.get('jwtAuthorization') != null) {
			axios.get(process.env.REACT_APP_IP + "auth/2fa/is2FA", {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then(() => {
					navigate('/home');
				})
				.catch((error) => {
					console.error(error.status)
				});
		}
	}, [navigate]);

  return (
	<div className="Auth">
		<div className="Auth-title">
			<h1>Transcendence</h1>
		</div>
		<div className="Auth-button">
			<Link to={process.env.REACT_APP_IP + "auth/login"}>
				<button className="login42">
					Login with 42
				</button>
			</Link>
		</div>
    </div>
  );
}
export default Auth;
