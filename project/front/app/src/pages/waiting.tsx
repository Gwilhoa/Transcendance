import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Waiting = () => {
	const [message, setMessage] = useState<string>('waiting.');
	const navigate = useNavigate();

	useEffect(() =>{
		const interval = setInterval(() => {
			setMessage((prevMessage) => {
				if (prevMessage === 'waiting...') {
					return 'waiting.';
				}
				else if (prevMessage === 'waiting.') {
					return 'waiting..';
				}
				else {
					return 'waiting...';
				}
			});
			if (localStorage.getItem('jwtAuthorization') != null) {
				navigate('/home');
			}
		}, 500);

		return () => {
			clearInterval(interval)
		};
	}, [navigate]);


	return (<p>{message}</p>);
};

export default Waiting;
