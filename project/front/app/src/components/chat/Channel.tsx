import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { cookies } from '../../App';
import { Channel, initialChannelState } from '../../pages/chat';
import { setErrorLocalStorage } from '../IfError';
import ButtonInviteChannel from './optionBar/button/ButtonInviteChannelModal';
import ButtonListChannel from './optionBar/button/ButtonListUserModal';
import ButtonUpdateChannel from './optionBar/button/ButtonUpdateChannel';

const ChannelSideBar = ({ channelId }: {channelId: string}) => {
	const [channel, setChannel] = useState<Channel>(initialChannelState);
	const navigate = useNavigate();

	useEffect(() => {
			axios.get(process.env.REACT_APP_IP + ':3000/channel/id/' + channelId,
		{
			headers: {Authorization: `bearer ${cookies.get('jwtAuthorization')}`,}
		})
		.then((response) => {
			console.log(response);
			setChannel(response.data);
		})
		.catch((error) => {
				if (error.response.status === 401 || error.response.status === 500) {
					setErrorLocalStorage('unauthorized');
					navigate('/Error');
				}
		});
	}, []);

	const parseChannelName = (channel: Channel) => {
		if (channel.type !== 3) {
			return (channel.name);
		}
		if (channel.users[0].id != localStorage.getItem('id')) {
			return (channel.users[0].username);
		}
		return (channel.users[1].username)
	};

	const isAdmin = (channel: Channel) => {
		if (channel.admins.some((admin) => admin.id === localStorage.getItem('id'))) {
			return(true);
		}
		return (false);
	};

	return (
		<div className='chat-side-bar-channel'>
			{parseChannelName(channel)}
			<div className='chat-side-bar-channel-modify-button'>
			{ isAdmin(channel) ? (
				<>
					<ButtonInviteChannel />
					<ButtonUpdateChannel /> 
					<ButtonListChannel />
				</>
			) : (
				<ButtonListChannel />
			)}
			</div>
		</div>		
	);
};

export default ChannelSideBar;
