import './css/sidebar.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cookies } from '../../App';
import { Channel } from '../../pages/chat';
import { setConversation } from '../../redux/chat/conversationIdSlice';
import { RootState } from '../../redux/store';
import SocketSingleton from '../../socket';
import ChannelSideBar from './Channel';
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

function SideBarChat(	{ listChannel, setConversationId }: 
						{	
							listChannel: Array<Channel>,
							setConversationId: React.Dispatch<React.SetStateAction<string>>
						}) {
	const dispatch = useDispatch();

	const handleSwitchChannel = (id: string) => {
		setConversationId(id);
	}

	return (
		<div className='chatSideBar'>
			{listChannel.map((channel) => (
				<div onClick={() => handleSwitchChannel(channel.id)} key={channel.id}>
					<ChannelSideBar channelId={channel.id} />
				</div>
			))}
		</div>
	);
}
export default SideBarChat;
