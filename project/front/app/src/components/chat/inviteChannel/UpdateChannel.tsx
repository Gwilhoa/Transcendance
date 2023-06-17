import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cookies } from '../../../App';
import {switchChatModalUpdateChannel} from '../../../redux/chat/modalChatSlice';
import { RootState } from '../../../redux/store';
import { setErrorLocalStorage } from '../../IfError';
import {Channel} from "../../../pages/chat";
import socket from "../../../socket";
import SocketSingleton from "../../../socket";

const UpdateChannel = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const channelId = useSelector((state: RootState) => state.conversation.id);
	const [channel, setChannel] = useState<Channel>();
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [name, setName] = useState<string>('');
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	useEffect(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/channel/id/' + channelId,
			{
				headers: {Authorization: `bearer ${cookies.get('jwtAuthorization')}`,}
			})
			.then((response) => {
				setChannel(response.data);
				console.log(response.data);
			})
			.catch((error) => {
				if (error.response.status === 401 || error.response.status === 500) {
					setErrorLocalStorage('unauthorized');
					navigate('/Error');
				}
			});
	},[]);

	const updateChannel = () => {
		console.log('test');
		socket.emit('update_channel', {
			channel_id: channelId,
			name : name,
			password: newPassword,
			old_password: password
		});
		dispatch(switchChatModalUpdateChannel());
	}

	return (
		<div className='page-shadow'>
			<div className='create-channel'>
				<h2>Modify channel</h2>
				<input type='text' placeholder='Channel name' onChange={(e) => setName(e.target.value)} />
				{(channel?.type == 1 || channel?.type == 2) ?
                    <input type='text' placeholder='new password' onChange={(e) => setNewPassword(e.target.value)}/> : <></> }

				{channel?.type == 2 ?
					<input type='text' placeholder='old password' onChange={(e) => setPassword(e.target.value)}/> : <></>}
				<button className='create-channel-button' onClick={updateChannel}>Update</button>
				<button className='close-create-channel' onClick={() => dispatch(switchChatModalUpdateChannel())} />
			</div>
		</div>
	);
};

export default UpdateChannel;
