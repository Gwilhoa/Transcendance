import React from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Cookies from 'universal-cookie';
import { setId } from '../../redux/id/idSlice';
import {closeModal} from '../../redux/modal/modalSlice';

const cookies = new Cookies();

function LogoutButton() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleOnClick = () => {

		dispatch(setId(null));
		dispatch(closeModal());
		cookies.remove('jwtAuthorization');
		navigate('/');
	};

	return (
		<button onClick={handleOnClick}>
			Logout
		</button>
	);
}

export default LogoutButton;
