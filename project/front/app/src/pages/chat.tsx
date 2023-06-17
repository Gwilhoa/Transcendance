import './css/chat.css'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Conversation from '../components/chat/conversation/conversation';
import CreateChannel from '../components/chat/createChannel/CreateChannel';
import InviteChannel from '../components/chat/inviteChannel/InviteChannel';
import OptionBar from '../components/chat/optionBar/optionBar';
import SideBarChat from '../components/chat/sidebar';
import ErrorToken, { setErrorLocalStorage } from '../components/IfError';
import { RootState } from '../redux/store';
import SendMessage from '../components/chat/input/sendmessage';
import { setConversation } from '../redux/chat/conversationIdSlice';
import SocketSingleton from '../socket';
import UpdateChannel from "../components/chat/inviteChannel/UpdateChannel";
import ListUserChannel from '../components/chat/ListUsers';
import axios from 'axios';
import { cookies } from '../App';
import { useNavigate } from 'react-router-dom';
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

export interface ChanMessage {
	channelId: string;
	ListMessages: Array<Message>;
}

export const initialUserState: User = {
	id: '',
	email: '',
	username: '',
	enabled2FA: false,
	experience: 0,
	status: 0,
}

export const initialChannelState: Channel = {
	id: '',
	name: '',
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
	const navigate = useNavigate();

	const [channel, setChannel] = useState<Channel>(initialChannelState);
	const [listChannel, setListChannel] = useState<Array<Channel>>([]);

	const [conversationId, setConversationId] = useState<string>('');

	const [messages, setMessages] = useState<Array<Message>>([]);
	
////////////////////////// FETCH DATA /////////////////////////////////////////
	const fetchListChannel = async () => {
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

	const fetchListMessage = async () => {
		try {
			const response = await axios.get(process.env.REACT_APP_IP + ':3000/channel/message/' + conversationId, {
				headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			});
			console.log(response);
			if (response.status === 204) {
				setMessages([]);
			}
			else {
				setMessages(response.data);
			}
		} catch (error: any) {
			console.error(error);
			if (error.response.status === 401 || error.response.status === 500) {
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
			}
		}
	};

	const fetchChannel= async () => {
		try {
			const response = await axios.get(process.env.REACT_APP_IP + ':3000/channel/id/' + conversationId, {
				headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			});
			console.log(response);
			setChannel(response.data);
		} catch (error: any) {
			console.error(error);
			if (error.response.status === 401 || error.response.status === 500) {
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
			}
		}
	};

////////////////////////// SOCKET /////////////////////////////////////////////
	useEffect(() =>{
		socket.on('join_code', handleJoinCode);
		socket.on('message', handleMessage);
		socket.on('message_code', handleMessageCode);
		socket.on('update_channel', handleUpdateChannel);

	}, [socket]);

	useEffect(() => {
		fetchListChannel();

		return () => {
			console.log('socket.off chat.');
			socket.off('join_code');
			socket.off('message');
			socket.off('message_code');
			socket.off('update_channel');
		};
	}, []);

////////////////////////// HANDLE SOCKET //////////////////////////////////////
	const handleJoinCode = (data: any) => { // TODO OPTI THAT SHIT PLS
		console.log('handleJoinCode');
		console.log(data);
		if (data.code == 0) {
			console.log('pls switch id');
			setConversationId(data.channel_id);
		}
		fetchListChannel();
	};

	const handleMessage = (data: any) => {
		const newItemMessage: Message = {
			content: data.content,
			id: data.id,
			user: data.user,
			date: data.date,
		}
		console.log(newItemMessage);
		setMessages((prevListMessage) => {
			if (prevListMessage.length === 0) {
				return [newItemMessage];
			} 
			else if (!prevListMessage.some((message) => message.id === newItemMessage.id)) {
				return [...prevListMessage, newItemMessage];
			}
			else {
				return prevListMessage;
			}
		});
		
		return ;
	};

	const handleMessageCode = (data: any) => {
		console.log(data);
	};

	const handleUpdateChannel = (data: any) => {
		console.log('HEY I CHANGE NAME : ' + data?.id);
		if (conversationId === data?.channel_id) {
			const updatedChannel = {...channel, name: data.name};
			setChannel(updatedChannel);
		}
		fetchListChannel();
	};

	useEffect(()=>{
		console.log('channel id : ' + conversationId);
		fetchListMessage();
		fetchChannel();

	},[conversationId]);

	return (
		<div className='chatPage'>
			<ErrorToken />
			<OptionBar/>
			{isOpenSideBar && ( <SideBarChat 
									listChannel={listChannel} 
									setConversationId={setConversationId} 
								/> )}
			{isOpenCreateChannel && ( <CreateChannel /> )}
			{isOpenInviteChannel && ( <InviteChannel channel={channel}/> )}
			{isOpenUpdateChannel && ( <UpdateChannel channel={channel}/> )}
			<div className='chat-right-page'>
				<Conversation listMessages={messages} channel={channel}/>
				<SendMessage conversation={conversationId}/>
			</div>
			{isOpenListUserChannel && ( <ListUserChannel channel={channel} /> )}
		</div>
	);
}
export default Chat;
