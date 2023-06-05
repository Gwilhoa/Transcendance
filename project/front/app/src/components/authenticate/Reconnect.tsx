import React from "react";
import { Link } from "react-router-dom";

function Reconnect() {
	console.log(process.env.REACT_APP_IP + ":8080/");
	return (
		<div>
			<p>{localStorage.getItem('Error')}</p>
			<Link to= {process.env.REACT_APP_IP + ":8080/"}>
				<button>
					Try to reconnect
				</button>
			</Link>
		</div>
	);
}

export default Reconnect;
