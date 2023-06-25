import '../App.css'
import React, {useEffect, useState} from 'react';
import Head from './header';
import Notification from '../components/notification/notification';
import {Outlet, useNavigate} from 'react-router-dom';
import SocketSingleton from '../socket';
import {setBeginStatus} from "../redux/game/beginToOption";
import {useDispatch, useSelector} from "react-redux";
import { cookies } from '../App';
import { setErrorLocalStorage } from '../components/IfError';
import axios from 'axios';
import { RootState } from '../redux/store';


const Template = () => {
	let friendId = 0;
	let rivalId = 0;
	const navigate = useNavigate();
	const [notif, setNotif] = useState(<></>);
	const [notifVisible, setNotifVisible] = useState(false);
	const myId = useSelector((state: RootState) => state.id.id);

	const dispatch = useDispatch();
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	socket.on('message_code', (data: any) => {
		console.log(data);
	});

	//const location = useLocation();

	//useEffect(() => {
	//if (location.pathname === '/') {
	//  window.location.reload();
	//}
	//socket = io(process.env.REACT_APP_IP + ':3000', {
	//  transports: ['websocket']
	//});
	//}, []);

	const confirmFriend = () => {
		console.log('confirm friend')
		socket.emit('friend_request', {friend_id: friendId, token: cookies.get('jwtAuthorization')})
	}

	const rejectFriend = () => {
		console.log('reject friend')
	}



	function confirmChallenge() {
		console.log('confirm challenge')
		socket.emit('challenge', {rival_id: rivalId, token: cookies.get('jwtAuthorization')})
	}

	function rejectChallenge() {
		console.log('reject challenge')
	}

	useEffect(() => {	
		socket.on('receive_challenge', (data: any) => {
			console.log(data);
			if (data.code == 3) {
				socket.on('game_found', (data) => {
					console.log(data);
					dispatch(setBeginStatus({decide: data.decide, playerstate: data.user, gameid: data.game_id, gamestate: 1}));
					socket.emit('leave_matchmaking', {token: cookies.get('jwtAuthorization')})
					navigate("/optiongame")
					socket.off('game_found')
				});
				navigate('/optiongame');
			} else if (data.code == 2) {
				rivalId = data.rival;
				setNotif(<Notification message={data.rival_name + ' wants battle'} onConfirm={confirmChallenge} onCancel={rejectChallenge} hasButton={true} setVisible={setNotifVisible}/>)
				setNotifVisible(true);
			}
		});

		socket.on('connection_error', (data:any) => {
			console.log(data);
			setErrorLocalStorage('unauthorized')
			navigate('/error');
		});

		socket.on('message', (data: any) => {
			console.log(data)
		})

		socket.on('friend_request', (data: any) => {
			if (data.code == 4) {
				friendId = data.id;
				setNotif(<Notification message={'New friend'} onConfirm={confirmFriend} onCancel={rejectFriend}
					hasButton={true} setVisible={setNotifVisible}/>);
				setNotifVisible(true)
			}
		})

		socket.on('friend_code', (data: any) => {
			console.log(data);
			let otherId = data.user1;
			if (otherId == myId) {
				otherId = data.user2;
			}
			if (data.code === 2) {
				axios.post(process.env.REACT_APP_IP + ':3000/channel/mp/create',
					{
						user_id: '' + otherId,
					},
					{
						headers: {
							Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
						},
					})
					.then((response) => {
						console.log(response);
					})
					.catch((error) => {
						setErrorLocalStorage('Error ' + error?.response?.status);
						navigate('/Error');
					});
			}
		})
		return () => {
			socket.off('receive_challenge');
			socket.off('connection_error');
			socket.off('message');
			socket.off('friend_request');
		};
	}, []);

	return (
		<div className='page'>
			{notifVisible &&
                <>
					{notif}
                </>
			}
			<main className='main-template'>
				<Outlet></Outlet>
			</main>
			<header>
				<Head/>
			</header>
		</div>
	);
}

export default Template
