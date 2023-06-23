import './template.css'
import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {setErrorLocalStorage} from '../components/IfError';
import Cookies from 'universal-cookie';
import {useDispatch} from 'react-redux';
import {openModal} from '../redux/modal/modalSlice';
import SocketSingleton from '../socket';
import axios from 'axios';
import { setBeginStatus } from '../redux/game/beginToOption';

const cookies = new Cookies();

const Head = () => {
	const [id, setId] = useState<string | null>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	socket.on('message_code', (data: any) => {
		console.log(data);
	});

	useEffect(() => {
		// if (localStorage.getItem('id') === null) {
			axios.get(process.env.REACT_APP_IP + ':3000/user/id', {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response.data.id);
					setId(response.data.id);
					localStorage.setItem('id', response.data.id);
				})
				.catch((error) => {
					setErrorLocalStorage('Error ' + error.response.status);
					console.error(error);
					navigate('/Error');
				});
		// } else {
		// 	setId(localStorage.getItem('id'));
		// }

		//todo: flo check stp
	}, [navigate]);

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
