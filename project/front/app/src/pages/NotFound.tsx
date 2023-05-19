import React from 'react';
import ErrorToken from '../components/IfError';

function NotFound () {
	return (
		<div>
			<ErrorToken />
			<h1>NotFound!!!</h1>
		</div>
	);	
}

export default NotFound;
