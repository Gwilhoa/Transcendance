import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IUser} from '../utils/interface';
import {useDispatch} from 'react-redux';
import {addUser, setUsers, setUsersNull} from '../../redux/search/searchSlice';
import SocketSingleton from '../../socket';
import { cookies } from '../../App';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();


const Search = (
	{ defaultAllUsers, OverwriteClassName, id }: 
	{
		defaultAllUsers: boolean,
		OverwriteClassName: string,
		id: string | null,
		}) => 
{
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [myId] = useState<string | null>(id);
	


	const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const res = event.target.value;
		if (res.length === 0 && defaultAllUsers === false) {
			dispatch(setUsersNull());
			console.log('handleOnChange null');
		} else {
			console.log('handleOnChange');
			console.log('emit: ' + res);
			socket.emit('research_name', {name: res, token: cookies.get('jwtAuthorization')});
		}
	};
	
	useEffect(() => {
		socket.on('research_name', (data: any) => {
			console.log('research_name received my_id : ' + myId + 'user_id : ' + data.id);
			const UsersWithoutYou = data.filter((user: IUser) => user.id !== myId);
			dispatch(setUsers(UsersWithoutYou));
			console.log('research_name');
			console.log(data);
		});

		socket.on('new_user', (data: IUser) => {
			if (data.id !== myId)
				dispatch(addUser(data));
		});

		return () => {
			socket.off('new_user');
			socket.off('research_name');
		};
	}, [navigate, dispatch, myId]);

	return (
		<input type='search' placeholder='Search' className={'search-bar' + ' ' + OverwriteClassName}
			onChange={handleOnChange}></input>
	);
}

export default Search;
