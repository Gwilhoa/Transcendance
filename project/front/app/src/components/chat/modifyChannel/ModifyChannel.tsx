import '../css/modifyChannel.css';
import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {switchChatModalUpdateChannel} from '../../../redux/chat/modalChatSlice';
import {Channel} from "../../../pages/chat";
import SocketSingleton from "../../../socket";

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

const ModifyChannel = ({channel}: { channel: Channel }) => {
	const dispatch = useDispatch();
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [name, setName] = useState<string>('');

	const updateChannel = () => {
		socket.emit('update_channel', {
			channel_id: channel.id,
			name: name,
			password: newPassword,
			old_password: password
		});
		dispatch(switchChatModalUpdateChannel());
	}

	return (
		<div className='page-shadow'>
			<div className='chat-side-bar-modify-channel'>
				<h2>Modify channel</h2>
				<button className='chat-side-bar-close-modify-channel'
						onClick={() => dispatch(switchChatModalUpdateChannel())}/>

				<h3>Channel Name</h3>
				<input className='chat-side-bar-close-modify-channel-name' type='text' placeholder='Channel name'
					onChange={(e) => setName(e.target.value)}/>

				
				{(channel?.type == 1 || channel?.type == 2) ?
					<>
						<h3>Channel Name</h3>
						<input className='chat-side-bar-close-modify-channel-password' type='text' placeholder='old password'
						onChange={(e) => setPassword(e.target.value)}/>
					</>: <></>}

				{channel?.type == 2 ?
					<input className='chat-side-bar-close-modify-channel-password' type='text' placeholder='new password'
					onChange={(e) => setNewPassword(e.target.value)}/> : <></>}


				<button className='chat-side-bar-modify-channel-button-update' onClick={updateChannel}>Update</button>
			</div>
		</div>
	);
};

export default ModifyChannel;
