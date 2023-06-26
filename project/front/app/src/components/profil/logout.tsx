import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {closeModal} from '../../redux/modal/modalSlice';


function LogoutButton() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleOnClick = () => {

		dispatch(closeModal());
		localStorage.removeItem('jwtAuthorization');
		navigate('/');
	};

	return (
		<button onClick={handleOnClick}>
			Logout
		</button>
	);
}

export default LogoutButton;
