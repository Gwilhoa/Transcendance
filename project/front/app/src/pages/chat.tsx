import './css/chat.css'
import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { cookies } from '../App';
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




////////////////////////// CHAT ///////////////////////////////////////////////
function Chat() {
	const isOpenSideBar = useSelector((state: RootState) => state.modalChat.isOpenSideBar);
	const isOpenCreateChannel = useSelector((state: RootState) => state.modalChat.isOpenCreateChannel);
	const isOpenInviteChannel = useSelector((state: RootState) => state.modalChat.isOpenInviteChannel);
	const isOpenUpdateChannel = useSelector((state: RootState) => state.modalChat.isOpenUpdateChannel);
	const isOpenListUserChannel = useSelector((state: RootState) => state.modalChat.isOpenListUser);

	const dispatch = useDispatch();

	const [channel, setChannel] = useState<Channel>(initialChannelState);
	const [listChannel, setListChannel] = useState<Array<Channel>>([]);

	const [conversationId, setConversationId] = useState<string>('');
	
////////////////////////// FETCH DATA /////////////////////////////////////////
	const fetchListChannel = async ( { setListChannel }: {setListChannel: React.Dispatch<React.SetStateAction<Array<Channel>>>} ) => {
		try {
			const response = await axios.get(process.env.REACT_APP_IP + ':3000/user/channels', {
				headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			});
			console.log(response);
			setListChannel(response.data);
		} catch (error) {
			console.error(error);
		}
	};

////////////////////////// SOCKET /////////////////////////////////////////////
	useEffect(() =>{
		socket.on('join_code', handleJoinCode);
	}, [socket])

	useEffect(() => {
		fetchListChannel({setListChannel});
	}, []);

////////////////////////// HANDLE SOCKET //////////////////////////////////////
const handleJoinCode = (data: any) => {
	console.log('handleJoinCode');
	console.log(data);
	fetchListChannel({setListChannel});
};
	return (
		<div className='chatPage'>
			<ErrorToken />
			<OptionBar/>
			{isOpenSideBar && ( <SideBarChat 
									listChannel={listChannel} 
									setConversationId={setConversationId} 
								/> )}
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
