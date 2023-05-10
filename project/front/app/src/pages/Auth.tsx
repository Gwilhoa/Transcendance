import React from 'react';
import './Auth.css';
import { Link } from "react-router-dom";

function Auth() {
  //state

  //comportement

  //render	
  return (
	<div className="Auth">
		<div className="Auth-title">
			<h1>Transcendence</h1>
		</div>
		<div className="Auth-button">
			<Link to="http://localhost:3000/auth/login">
				<button className="login42">
					Login with 42
				</button>
			</Link>
		</div>
    </div>
  );
}
export default Auth;
