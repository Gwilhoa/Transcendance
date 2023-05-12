import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
	
interface MessageProps {
  message: string;
}

function Reconnect(props:MessageProps) {
	return (
		<div>
			<p>{props.message}</p>
			<Link to="http://localhost:8080/">
				<button>
					Try to reconnect
				</button>
			</Link>
		</div>
	);
}

export default Reconnect;
