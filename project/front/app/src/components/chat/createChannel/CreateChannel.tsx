import '../css/CreateChannel.css'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { switchChatModalCreateChannel } from '../../../redux/chat/modalChatSlice';
import { Channel } from '../../../pages/chat';
import { ButtonInputToggle } from '../../utils/inputButton';
import { cookies } from '../../../App';
import axios from 'axios';
import { setConversation } from '../../../redux/chat/conversationIdSlice';
import SocketSingleton from '../../../socket';
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();


const initialState: Channel= {
	id: '',
	name: 'New Channel',
	topic: null,
	type: 0,
	pwd: null,
	users: [],
}
const CreateChannel = () => {
	const dispatch = useDispatch();
	const [channelParams, setChannelParams] = useState<Channel>(initialState);
	const [id, setId] = useState<string>('');

	const onSubmitChannelName = (str: string) => {
		setChannelParams((prevChannelParams) => ({
			...prevChannelParams,
			name: str,
		}));	
	};

	const handlePasswordChange = (str:string) => {
		setChannelParams((prevChannelParams) => ({
			...prevChannelParams,
			pwd: str,
		}));
	};

	const handleChannelTypeChange = (type: number) => {
		setChannelParams((prevChannelParams) => ({
			...prevChannelParams,
			type: type,
		}));
	};

	const handleNewChannel = () => {
		console.log('send');
		console.log(channelParams);
		axios.post(process.env.REACT_APP_IP + ':3000/channel/create',
			{
				name: channelParams.name,
				creator_id: localStorage.getItem('id'), 
				type: channelParams.type,
				password: channelParams.pwd,
			},
			{
				headers: {Authorization: `bearer ${cookies.get('jwtAuthorization')}`,}
			})
			.then((response) => {
				console.log(response);
				setId(response.data.id);
			})
			.catch((error) => {
				console.error(error)
			});
		if (channelParams.type == 0 ) {
			console.log('hey need an other call')
		}
		socket.emit('join_channel', {id: id});
		dispatch(setConversation(channelParams.id));
		dispatch(switchChatModalCreateChannel());
		return;
	};

	const getTypeLabel = (type: number) => {
		switch (type) {
			case 0:
				return 'Private';
			case 1:
				return 'Public';
			case 2:
				return 'Protected';
			default:
				return '';
		}
	};

	return (
	<div className='page-shadow'>
		<div className='create-channel'>
			<h2>Create Channel</h2>
			<h3>Channel Name</h3>
			<button className='close-create-channel' onClick={() => dispatch(switchChatModalCreateChannel())} />
			<input className='channel-name-input' type='text' placeholder='Channel Name' value={channelParams.name} onChange={(e) => onSubmitChannelName(e.target.value)}/>
			<div className='ButtonChangeTypeChannel'>
				<h3>Channel Type</h3>
				<button className='channel-type-button' onClick={() => handleChannelTypeChange(0)}>Private</button>
				<button className='channel-type-button' onClick={() => handleChannelTypeChange(1)}>Public</button>
				<button className='channel-type-button' onClick={() => handleChannelTypeChange(2)}>Protected</button>
			</div>
			{channelParams.type === 2 ? (
			<>
				<div className='divInputPassword'>
					<h3>Password</h3>
					<input
						className='channel-password-input'
						placeholder='Password'
						type='password'
						id='password'
						onChange={() => handlePasswordChange}
					/>
				</div>
			</>
			) : (<></>)}
			{channelParams.type === 0 ? (
			<>
				<div className='divFindUser'>
					<h3>Invite some friend:</h3>
				</div>
			</>
			) : (<></>)}

			<button className='channel-create-channel-button' onClick={() => handleNewChannel()}>New Channel</button>
		</div>
	</div>
	);
}

export default CreateChannel;
