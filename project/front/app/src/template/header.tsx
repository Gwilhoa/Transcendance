import './template.css'
import {Link, useNavigate} from 'react-router-dom';
import React, { useState } from 'react';
import {useDispatch} from 'react-redux';
import {openModal} from '../redux/modal/modalSlice';
import {setBeginStatus} from "../redux/game/beginToOption";
import jwtDecode from 'jwt-decode';


const Head = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const jwt: string = jwtDecode(''+localStorage.getItem('jwtAuthorization')) ;
	const [id] = useState<string>(jwt.sub);

	console.log(id);

	const handleOpenModal = (id: string | null) => {
		dispatch(openModal(id));
	};

	const handleChat = () => {
		navigate('/chat');
		window.location.reload();
	};

	const handleHisto = () => {
		navigate('/history/' + id);
		window.location.reload();
	};

	const setData = () => {
		dispatch(setBeginStatus({gamestate: 10}));
	}

	return (
		<div className='navbar'>
			<div className='navbar__link'>
				<Link to='/home' className='transcendance-link'>
					Transcendence
				</Link>
			</div>
			<div>

				<button onClick={() => handleChat()} className='navbar__link'>
					Chat
				</button>
				<Link to="/begingame" className="navbar__link" onClick={setData}>
					Game
				</Link>
				<button onClick={() => handleHisto()} className='navbar__link'>
					History
				</button>
				<button onClick={() => handleOpenModal(id)} className='navbar__link'>
					Profil
				</button>
			</div>
		</div>
	);
}

export default Head
