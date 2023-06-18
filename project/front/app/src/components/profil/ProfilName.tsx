import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {setErrorLocalStorage} from '../IfError';
import Cookies from 'universal-cookie';
import SocketSingleton from '../../socket';

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

export const ProfilName = ({id}: { id: string | null }) => {
	const [userStatus, setUserStatus] = useState('');
	const navigate = useNavigate();
	const [username, setUsername] = useState<string>('');

	const changeName = () => {
		axios.get(process.env.REACT_APP_IP + ':3000/user/id/' + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data.username;
				setUsername(data);
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}

	useEffect(() => {
		setUserStatus('profil-status-disconnected');
		changeName();
		axios.get(process.env.REACT_APP_IP + ':3000/user/id/' + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				if (response.data.status === UserStatus.CONNECTED) {
					setUserStatus('profil-status-connected');
				}
				if (response.data.status === UserStatus.IN_GAME) {
					setUserStatus('profil-status-in-game');
				}
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
			});

		socket.on('connection_server', (data: any) => {
			if (data.connected.includes() != null)
				setUserStatus('profil-status-connected');
			if (data.connected.includes() != null)
				setUserStatus('profil-status-in-game');
		});

		socket.on('update_profil', (data: any) => {
			if (data.type === 'name')
				changeName();
		});

		return () => {
			socket.off('update_profil');
			socket.off('connection_server');
		};
	}, [navigate, socket])

	return (
		<div> {username} </div>
	);
}
