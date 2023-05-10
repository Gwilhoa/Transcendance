import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
	
interface MessageProps {
  message: string;
}

function Reconnect(props:MessageProps) {
	return (
		<div>
			<p>{props.message}</p>
			<Link to="http://localhost:3000/auth/login">
				<button>
					Try to reconnect
				</button>
			</Link>
		</div>
	);
}

export default Reconnect;
