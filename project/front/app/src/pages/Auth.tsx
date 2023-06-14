import './css/auth.css'
import axios from 'axios';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
import logo from '../images/pegi18.png'

function Auth() {
	const navigate = useNavigate();

	localStorage.removeItem('Error');
	localStorage.removeItem('id');
	useEffect(() => {
		if (cookies.get('jwtAuthorization') != null) {
			axios.get(process.env.REACT_APP_IP + ':3000/auth/2fa/is2FA', {
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
	<div className='center-auth'>
		<div className='auth-page'>
			<div className='auth-block'>
				<header className='auth-title'>
					<img className='transcendence-image' src={logo}/>
					<h1>Transcendence</h1>
				</header>
				<div className='auth-button'>
					<Link to={process.env.REACT_APP_IP + ':3000/auth/login'}>
						<button className='login-button'>
							Login
						</button>
					</Link>
				</div>
			</div>
		</div>
    </div>
  );
}
export default Auth;
