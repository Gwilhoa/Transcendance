import '../App.css'
import React, {useEffect, useState} from 'react';
import Head from './header';
import Notification from '../components/notification/notification';
import {Outlet, useNavigate} from 'react-router-dom';
import SocketSingleton from '../socket';
import {setBeginStatus} from "../redux/game/beginToOption";
import {useDispatch, useSelector} from "react-redux";
import { setErrorLocalStorage } from '../components/IfError';
import {RootState} from "../redux/store";


const Template = () => {
	let friendId = '';
	let rivalId = '';
	const navigate = useNavigate();
	const [notif, setNotif] = useState(<></>);
	const [notifVisible, setNotifVisible] = useState(false);

	const dispatch = useDispatch();
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	const conversationId  = useSelector((state: RootState) => state.conversationId.id);


	const confirmFriend = () => {
		console.log('confirm friend')
		socket.emit('friend_request', {friend_id: friendId, token: localStorage.getItem('jwtAuthorization')})
	}

	const rejectFriend = () => {
		console.log('reject friend')
	}



	function confirmChallenge() {
		console.log('confirm challenge')
		socket.emit('challenge', {rival_id: rivalId, token: localStorage.getItem('jwtAuthorization')})
	}

	function rejectChallenge() {
		console.log('reject challenge')
	}

	useEffect(() => {	
		console.log('bonjour je suis le template');
		socket.on('receive_challenge', (data: any) => {
			console.log(data);
			if (data.code == 3) {
				socket.on('game_found', (data) => {
					console.log(data);
					dispatch(setBeginStatus({decide: data.decide, playerstate: data.user, gameid: data.game_id, gamestate: 1}));
					socket.emit('leave_matchmaking', {token: localStorage.getItem('jwtAuthorization')})
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

		socket.on('notif_message', (data: any) => {
			console.log(conversationId);
			console.log(data.channel.id);
			console.log(data);
			console.log(conversationId == data.channel.id);
			if (conversationId == data.channel.id)
				return;
			let newmessage = data.user.username + ' : ' + data.content;
			if (data.content.length > 16) {
				newmessage = data.user.username + ' : ' + data.content.substring(0, 16) + '...';
			}
			setNotif(<Notification message={newmessage} onConfirm={() => {null}} onCancel={() => {null}} hasButton={false} setVisible={setNotifVisible}/>)
			setNotifVisible(true);
		})

		socket.on('friend_notif', (data: any) => {
			console.count('friend_request');
			if (data.code == 4) {
				friendId = data.id;
				setNotif(<Notification message={'New friend'} onConfirm={confirmFriend} onCancel={rejectFriend}
					hasButton={true} setVisible={setNotifVisible}/>);
				setNotifVisible(true)
			}
		})

		return () => {
			socket.off('receive_challenge');
			socket.off('connection_error');
			socket.off('message');
			socket.off('friend_request');
		};
	}, [navigate, conversationId]);

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
