import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {IUser} from '../utils/interface';
import {useDispatch} from 'react-redux';
import {addUser, setUsers, setUsersNull} from '../../redux/search/searchSlice';

import SocketSingleton from '../../socket';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
export const Search = ({defaultAllUsers, OverwriteClassName}: {
	defaultAllUsers: boolean,
	OverwriteClassName: string
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const id = localStorage.getItem('id');

	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const res = event.target.value;
		if (res.length === 0 && defaultAllUsers === false) {
			dispatch(setUsersNull());
			console.log('handleOnChange null');
		} else {
			console.log('handleOnChange');
			console.log('emit: ' + res);
			socket.emit('research_name', {name: res});
		}
	};

	useEffect(() => {
		socket.on('research_name', (data: any) => {
			console.log('research_name received');
			const UsersWithoutYou = data.filter((user: IUser) => user.id !== id);
			dispatch(setUsers(UsersWithoutYou));
			console.log('research_name');
			console.log(data);
		});

		socket.on('new_user', (data: IUser) => {
			console.log(data);
			dispatch(addUser(data));
		});
	}, [navigate, dispatch, socket]);

	return (
		<input type='search' placeholder='Search' className={'search-bar' + ' ' + OverwriteClassName}
			onChange={handleOnChange}></input>
	);
}