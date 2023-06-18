import './css/sidebar.css'
import React from 'react'
import {Channel} from '../../pages/chat';
import ChannelSideBar from './Channel';

function SideBarChat({listChannel, setConversationId}:
							{
								listChannel: Array<Channel>,
								setConversationId: React.Dispatch<React.SetStateAction<string>>
							}) {

	const handleSwitchChannel = (id: string) => {
		setConversationId(id);
	}

	return (
		<div className='chatSideBar'>
			{listChannel.map((channel) => (
				<div onClick={() => handleSwitchChannel(channel.id)} key={channel.id}>
					<ChannelSideBar channel={channel}/>
				</div>
			))}
		</div>
	);
}

export default SideBarChat;
