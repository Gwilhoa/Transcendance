import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { cookies } from '../../App';
import { Channel, User } from '../../pages/chat';
import { setErrorLocalStorage } from '../IfError';
import ButtonInviteChannel from './optionBar/button/ButtonInviteChannelModal';
import ButtonUpdateChannel from './optionBar/button/ButtonUpdateChannel';


const initialUserState: User= {
	id: '',
	email: '',
	username: '',
	enabled2FA: false,
	experience: 0,
	status: 0,
}

const initialChannelState: Channel= {
	id: '',
	name: 'New Channel',
	topic: null,
	type: 0,
	pwd: null,
	users: [],
	creator: initialUserState,
	admins: [],
	bannedUsers: [],

}

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
	}

	return (
		<div className='chat-side-bar-channel'>
			{parseChannelName(channel)}
			<div className='chat-side-bar-channel-modify-button'>
				<ButtonInviteChannel />
				<ButtonUpdateChannel />
			</div>
		</div>		
	);
};

export default ChannelSideBar;
