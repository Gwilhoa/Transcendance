import './css/chat.css'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Conversation from '../components/chat/conversation/conversation';
import CreateChannel from '../components/chat/createChannel/CreateChannel';
import InviteChannel from '../components/chat/inviteChannel/InviteChannel';
import OptionBar from '../components/chat/optionBar/optionBar';
import SideBarChat from '../components/chat/sidebar';
import ErrorToken from '../components/IfError';
import { RootState } from '../redux/store';
import SendMessage from '../components/chat/input/sendmessage';
import { setConversation } from '../redux/chat/conversationIdSlice';
import SocketSingleton from '../socket';
import UpdateChannel from "../components/chat/inviteChannel/UpdateChannel";
import ListUserChannel from '../components/chat/ListUsers';
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

export interface User {
	id: string;
	email: string;
	username: string;
	enabled2FA: boolean;
	experience: number;
	status: number;
}

export interface Channel {
	id: string;
	name: string;
	topic: string | null;
	type: number;
	pwd: string | null;
	creator: User;
	users: Array<User>;
	admins: Array<User>;
	bannedUsers: Array<User>;
}

export interface Message {
	content: string;
	date: string;
	id: string;
	user: User;
}

export const initialUserState: User= {
	id: '',
	email: '',
	username: '',
	enabled2FA: false,
	experience: 0,
	status: 0,
}

export const initialChannelState: Channel= {
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

function Chat() {
	const dispatch = useDispatch();
	const isOpenSideBar = useSelector((state: RootState) => state.modalChat.isOpenSideBar);
	const isOpenCreateChannel = useSelector((state: RootState) => state.modalChat.isOpenCreateChannel);
	const isOpenInviteChannel = useSelector((state: RootState) => state.modalChat.isOpenInviteChannel);
	const isOpenUpdateChannel = useSelector((state: RootState) => state.modalChat.isOpenUpdateChannel);
	const isOpenListUserChannel = useSelector((state: RootState) => state.modalChat.isOpenListUser);
	const conversationId = useSelector((state: RootState) => state.conversation.id);
	
	useEffect(() => {
		if (conversationId === '' && localStorage.getItem('conversationId') != '') {
			dispatch(setConversation('' + localStorage.getItem('conversationId')));
		}
	}, []);

	useEffect(() =>{
		socket.on('join_code', (data: any) => {
			console.log('join_code ' + data.code)
			console.log(data);
			dispatch(setConversation(data.channel_id));
			return ;
		});
	}, [socket])

	return (
		<div className='chatPage'>
			<ErrorToken />
			<OptionBar/>
			{isOpenSideBar && ( <SideBarChat /> )}
			{isOpenCreateChannel && ( <CreateChannel /> )}
			{isOpenInviteChannel && ( <InviteChannel /> )}
			{isOpenUpdateChannel && ( <UpdateChannel /> )}
			<div className='chat-right-page'>
				<Conversation />
				<SendMessage />
			</div>
			{isOpenListUserChannel && ( <ListUserChannel /> )}
		</div>
	);
}
export default Chat;
