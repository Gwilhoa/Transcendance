import React from "react";
import Reconnect from "../components/Reconnect";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const TryToReconnect = () => {

	return (
			<Reconnect/> 
	);
}

export default TryToReconnect;
