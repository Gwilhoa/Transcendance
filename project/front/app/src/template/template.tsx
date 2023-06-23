import '../App.css'
import React, {useState} from 'react';
import Head from './header';
import Notification from '../components/notification/notification';
import {Outlet} from 'react-router-dom';
import SocketSingleton from '../socket';


const Template = () => {
	let friendId = 0;
	const [notif, setNotif] = useState(<></>);
	const [notifVisible, setNotifVisible] = useState(false);

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
		socket.emit('friend_request', {friend_id: friendId})
	}

	const rejectFriend = () => {
		console.log('reject friend')
	}

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

	socket.on('challenge', (data: any) => {
		console.log(data);
	});


	return (
		<div className='page'>
			<header>
				<Head/>
			</header>
			{notifVisible &&
                <>
					{notif}
                </>
			}
			<main className='main-template'>
				<Outlet></Outlet>
			</main>
		</div>
	);
}

export default Template
