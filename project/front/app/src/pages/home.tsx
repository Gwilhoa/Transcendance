import './css/home.css'
import '../components/notification/notification.css'
import React, {useCallback, useEffect, useState} from 'react';
import ErrorToken, {setErrorLocalStorage} from '../components/IfError';
import {useNavigate} from 'react-router-dom';
import {cookies} from '../App';
import {IUser} from '../components/utils/interface';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {openModal} from '../redux/modal/modalSlice';
import {Search} from '../components/search/userSearch';
import axios from 'axios';
import SocketSingleton from '../socket';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
socket.on('message_code', (data: any) => {
	console.log(data);
});


const Add = () => {
	const [listUser, setListUser] = useState<Array<IUser> | null>([]);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	console.log('Add');
	const searchUser = (useSelector((state: RootState) => state.searchUser.users));
	useEffect(() => {
		setListUser(searchUser);
	}, [searchUser]);

	console.log(listUser?.length);
	if (listUser == null)
		console.log('listUser null');
	const refresh = useCallback(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/user/friend', {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((res) => {
				console.log(res);
				setListUser(res.data);
			})
			.catch((error) => {
				console.error(error);
				setErrorLocalStorage(error.response.status);
				navigate('/Error');
			})
	}, [navigate]);


	useEffect(() => {
		if (listUser == null) {
			refresh();
			socket.on('friend_code', (data: any) => {
				if (data.code == 2) {
					refresh()
					return;
				} else if (data.code === 5 || data.code === 7) {
					refresh();
				}
				return;
			})

			socket.on('friend_request', (data: any) => {
				console.log('before code');
				if (data.code == 2 || data.code == 7) {
					console.log('refresh friend request');
					refresh();
					return;
				}
				return;
			})
		}
	}, [listUser, refresh, socket]);

	if (listUser == null || listUser.length == 0) {
		return (
			<p className='no-friend'>Knowing how to enjoy your own company is an art. <span>Natasha Adamo</span></p>);
	}
	console.log(listUser);
	return (
		<div className='users-list'>
			{listUser.map((user) => (
				<div className='user' key={user.id} onClick={() => dispatch(openModal(user.id))}>
					<img className='image'
						 src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png'></img>
					<p className='name'>{user.username}</p>
					<p className='status'>{user.status}</p>
					<p className='xp'>{user.experience}XP</p>
				</div>
			))}
		</div>
	);
}

const Home = () => {


	return (
		<div className='home'>
			<ErrorToken/>
			<div className='scrollBlock'>
				<Search defaultAllUsers={false} OverwriteClassName={''}/>
				<Add/>
			</div>
		</div>
	);

}

export default Home;

