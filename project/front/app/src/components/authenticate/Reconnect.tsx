import React from "react";
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function Reconnect() {
	return (
		<div>
			<p>{cookies.get('Error')}</p>
			<Link to="http://localhost:8080/">
				<button>
					Try to reconnect
				</button>
			</Link>
		</div>
	);
}

export default Reconnect;
