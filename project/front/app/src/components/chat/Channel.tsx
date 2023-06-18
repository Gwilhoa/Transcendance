import React from 'react'
import { Channel } from '../../pages/chat';
import ButtonInviteChannel from './optionBar/button/ButtonInviteChannelModal';
import ButtonUpdateChannel from './optionBar/button/ButtonUpdateChannel';
import ButtonLeaveChannel from './optionBar/button/ButtonLeaveChannel';


const ChannelSideBar = ({ channel }: {channel: Channel}) => {

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
				</>
			) : null}
				<ButtonLeaveChannel channelId={channel.id} />
			</div>
		</div>		
	);
};

export default ChannelSideBar;
