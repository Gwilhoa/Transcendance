import React from "react";
import { Link } from "react-router-dom";

function Reconnect() {
	return (
		<div className="Error-page">
			<p className="Error-description">{localStorage.getItem('Error')}</p>
			<Link to="http://localhost:8080/">
				<button className="login-button">
					Try to reconnect
				</button>
			</Link>
		</div>
	);
}

export default Reconnect;
