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
	
	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const res = event.target.value;
		if (res.length === 0 && defaultAllUsers === false) {
			dispatch(setUsersNull());
		} else {
			socket.emit('research_name', {name: res});
		}
	};
	
	useEffect(() => {
		const id = localStorage.getItem('id');
		socket.on('research_name', (data: any) => {
			const UsersWithoutYou = data.filter((user: IUser) => user.id !== id);
			dispatch(setUsers(UsersWithoutYou));
		});

		socket.on('new_user', (data: IUser) => {
			if (data.id !== id)
				dispatch(addUser(data));
		});
	}, [navigate, dispatch, socket]);

	return (
		<input type='search' placeholder='Search' className={'search-bar' + ' ' + OverwriteClassName}
			onChange={handleOnChange}></input>
	);
}