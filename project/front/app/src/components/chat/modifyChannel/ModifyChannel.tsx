import '../css/modifyChannel.css';
import React, {useState} from 'react'
import {useDispatch} from 'react-redux';
import {switchChatModalUpdateChannel} from '../../../redux/chat/modalChatSlice';
import {Channel} from "../../../pages/chat";
import axios from 'axios';
import { cookies } from '../../../App';

const ModifyChannel = ({channel}: { channel: Channel }) => {
	const dispatch = useDispatch();
	const [password, setPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [name, setName] = useState<string>('');

	const updateChannel = () => {
		axios.post(process.env.REACT_APP_IP + ':3000/channel/modifychannel/' + channel.id, 
		{
			name: name,
			password: newPassword,
			old_password: password
		},
		{
					headers: {
						Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
					},
		}).then((response) => {
			console.log('updatechannel');
			console.log(response);

			dispatch(switchChatModalUpdateChannel());
		}).catch((error) => {
			console.log('updatechannel');
			console.error(error);
		});
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
				{channel?.type == 2 ?
					<>
						<h3>Change Password</h3>
						<input className='chat-side-bar-close-modify-channel-password' type='text' placeholder='old password'
						onChange={(e) => setPassword(e.target.value)}/>
					</>: <></>}
				{(channel?.type == 1 || channel?.type == 2) ?
					<input className='chat-side-bar-close-modify-channel-password' type='text' placeholder='new password'
					onChange={(e) => setNewPassword(e.target.value)}/> : <></>}
				<button className='chat-side-bar-modify-channel-button-update' onClick={updateChannel}>Update</button>
			</div>
		</div>
	);
};

export default ModifyChannel;
