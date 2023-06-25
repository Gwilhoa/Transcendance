import React from 'react'
import {Channel, isAdmin} from '../../pages/chat';
import ButtonInviteChannel from './optionBar/button/ButtonInviteChannelModal';
import ButtonUpdateChannel from './optionBar/button/ButtonUpdateChannel';
import ButtonLeaveChannel from './optionBar/button/ButtonLeaveChannel';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export const parseChannelName = (channel: Channel, myId: string) => {
		if (channel.type !== 3) {
			return (channel.name);
		}
		if (channel.users[0].id != myId) {
			return (channel.users[0].username);
		}
		return (channel.users[1].username)
	};

const ChannelSideBar = ({channel}: { channel: Channel }) => {
	const myId = useSelector((state: RootState) => state.id.id);

	const troncChannelName = (channel: Channel) => {
		let name = parseChannelName(channel, '' + myId);
		if (name.length < 13) {
			return (name);
		}
		name = name.slice(0, 9) + '...';
		return (name);
	};

	return (
		<div className='chat-side-bar-channel'>
			{troncChannelName(channel)}
			<div className='chat-side-bar-channel-modify-button'>
				{isAdmin(channel, '' + myId) ? (
					<>
						<ButtonInviteChannel/>
						<ButtonUpdateChannel/>
					</>
				) : null}
				{channel.type != 3 && <ButtonLeaveChannel channelId={channel.id}/>}
			</div>
		</div>
	);
};

export default ChannelSideBar;
