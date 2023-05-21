import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function LogoutButton( { closeModal } : {closeModal:(param: boolean) => void;}) {
	const navigate = useNavigate();

	const handleOnClick = () => {
			navigate('/');
			closeModal(false);
			cookies.remove('jwtAuthorization');
		};

	return (
		<button onClick={handleOnClick}>
			Logout
		</button>
	);
}

export default LogoutButton;
