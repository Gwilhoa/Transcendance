import React from "react";
import { Link } from "react-router-dom";

function Reconnect() {
	return (
		<div>
			<p>{localStorage.getItem('Error')}</p>
			<Link to="http://localhost:8080/">
				<button>
					Try to reconnect
				</button>
			</Link>
		</div>
	);
}

export default Reconnect;
