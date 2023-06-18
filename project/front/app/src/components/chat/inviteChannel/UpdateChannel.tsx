import React, {useState} from 'react'
import { useDispatch } from 'react-redux';
import {switchChatModalUpdateChannel} from '../../../redux/chat/modalChatSlice';
import {Channel} from "../../../pages/chat";
import SocketSingleton from "../../../socket";
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

const UpdateChannel = ({ channel }: { channel: Channel }) => {
	const dispatch = useDispatch();
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [name, setName] = useState<string>('');

	const updateChannel = () => {
		socket.emit('update_channel', {
			channel_id: channel.id,
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
