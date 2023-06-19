import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {setErrorLocalStorage} from '../IfError';
import Cookies from 'universal-cookie';
import SocketSingleton from '../../socket';
import {useDispatch} from 'react-redux';
import {openModal} from '../../redux/modal/modalSlice';

const cookies = new Cookies();

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

enum UserStatus {
	CONNECTED = 0,
	IN_CONNECTION = 1,
	IN_GAME = 2,
	OFFLINE = 3,
	DISCONNECTED = 4,
}

export const ProfilImage = ({id, OnClickOpenProfil, OverwriteClassName}: {
	id: string,
	OnClickOpenProfil: boolean,
	OverwriteClassName: string
}) => {
	const [userStatus, setUserStatus] = useState('');
	const [image, setImage] = useState<string>('');
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const changeImage = () => {
		axios.get(process.env.REACT_APP_IP + ':3000/user/image/' + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setImage(data);
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}

	useEffect(() => {
		setUserStatus('profil-status-disconnected');
		changeImage();
		axios.get(process.env.REACT_APP_IP + ':3000/user/id/' + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				if (response.data.status === UserStatus.IN_GAME) {
					setUserStatus('profil-status-in-game');
				}
				else if (response.data.status === UserStatus.CONNECTED) {
					setUserStatus('profil-status-connected');
				}
				else {
					setUserStatus('profil-status-disconnected');
				}
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
			});

		socket.on('connection_server', (data: any) => {
			console.log(data);
			for (const ingame_id of data.ingame)
			{
				if (ingame_id == id) {
					setUserStatus('profil-status-in-game');
					return;
				}
		}
			for (const connected_id of data.connected) {
				console.log(connected_id + ' ' + id);
				if (connected_id == id) {
					console.log('connected')
					setUserStatus('profil-status-connected');
					return;
				}
				setUserStatus('profil-status-disconnected');
			}
		});

		socket.on('update_profil', (data: any) => {
			if (data.type === 'image')
				changeImage();
		});

		return () => {
			socket.off('update_profil');
			socket.off('connection_server');
		};
	}, [navigate, socket])

	return (
		<div key={'image'} className={'profil-image' + ' ' + OverwriteClassName}
				onClick={OnClickOpenProfil === true ? () => dispatch(openModal(id)) : undefined}>
			<img className='circle-image' src={image} alt='selected'/>
			<div className={'profil-status' + ' ' + userStatus}></div>
		</div>
	);
}
