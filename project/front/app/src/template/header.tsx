import './template.css'
import {Link, useNavigate} from 'react-router-dom';
import React, {useEffect} from 'react';
import {setErrorLocalStorage} from '../components/IfError';
import Cookies from 'universal-cookie';
import {useDispatch, useSelector} from 'react-redux';
import {openModal} from '../redux/modal/modalSlice';
import axios from 'axios';
import {setBeginStatus} from "../redux/game/beginToOption";
import { setId } from '../redux/id/idSlice';
import { RootState } from '../redux/store';

const cookies = new Cookies();

const Head = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const id = useSelector((state: RootState) => state.id.id);

	useEffect(() => {
		if (id == null) {
			axios.get(process.env.REACT_APP_IP + ':3000/user/id', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('jwtAuthorization')}`,
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
	}, [navigate, dispatch, id]);

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
