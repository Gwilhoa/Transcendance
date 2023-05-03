import React from 'react';
import { Link } from "react-router-dom";

function Auth() {
  //state

  //comportement

  //render	
  return (
	<div className="Authentificate">
		<h1>Transcendence</h1>
		<Link to="http://localhost:3000/auth/login">
		<button
		className="api42-link"
		>
			Authentification
		</button>
		</Link>
    </div>
  );
}
export default Auth;
