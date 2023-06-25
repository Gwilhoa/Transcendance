import './template.css'
import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {setErrorLocalStorage} from '../components/IfError';
import Cookies from 'universal-cookie';
import {useDispatch, useSelector} from 'react-redux';
import {openModal} from '../redux/modal/modalSlice';
import SocketSingleton from '../socket';
import axios from 'axios';
import {setBeginStatus} from "../redux/game/beginToOption";
import { setId } from '../redux/id/idSlice';
import { RootState } from '../redux/store';

const cookies = new Cookies();

const Head = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const id = useSelector((state: RootState) => state.id.id);

	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
		useEffect(() => {
		socket.on('message_code', (data: any) => {
			console.log(data);
		});
	
		return () => {
			socket.off('message_code');
		};
	}, []);

	useEffect(() => {
		if (id == null) {
			axios.get(process.env.REACT_APP_IP + ':3000/user/id', {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					console.log(response.data.id);
					localStorage.setItem('id', response.data.id);
					dispatch(setId(response.data.id));
				})
				.catch((error) => {
					setErrorLocalStorage('Error ' + error?.response?.status);
					console.error(error);
					navigate('/Error');
				});
	}
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
