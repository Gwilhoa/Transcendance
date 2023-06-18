import './css/chat.css'
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Conversation from '../components/chat/conversation/conversation';
import CreateChannel from '../components/chat/createChannel/CreateChannel';
import InviteChannel from '../components/chat/inviteChannel/InviteChannel';
import OptionBar from '../components/chat/optionBar/optionBar';
import SideBarChat from '../components/chat/sidebar';
import ErrorToken, {setErrorLocalStorage} from '../components/IfError';
import {RootState} from '../redux/store';
import SendMessage from '../components/chat/input/sendmessage';
import SocketSingleton from '../socket';
import ModifyChannel from "../components/chat/modifyChannel/ModifyChannel";
import ListUserChannel from '../components/chat/ListUsers';
import axios from 'axios';
import {cookies} from '../App';
import {useNavigate} from 'react-router-dom';

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

export const isAdmin = (channel: Channel) => {
		if (channel.admins.some((admin) => admin.id === localStorage.getItem('id'))) {
			return (true);
		}
		return (false);
};

////////////////////////// CHAT ///////////////////////////////////////////////
function Chat() {
	const isOpenSideBar = useSelector((state: RootState) => state.modalChat.isOpenSideBar);
	const isOpenCreateChannel = useSelector((state: RootState) => state.modalChat.isOpenCreateChannel);
	const isOpenInviteChannel = useSelector((state: RootState) => state.modalChat.isOpenInviteChannel);
	const isOpenUpdateChannel = useSelector((state: RootState) => state.modalChat.isOpenUpdateChannel);
	const isOpenListUserChannel = useSelector((state: RootState) => state.modalChat.isOpenListUser);

	const navigate = useNavigate();

	const [channel, setChannel] = useState<Channel>(initialChannelState);
	const [listChannel, setListChannel] = useState<Array<Channel>>([]);

	const [conversationId, setConversationId] = useState<string>('');
	const [updateChannel, setUpdateChannel] = useState<number>(0);

	const [messages, setMessages] = useState<Array<Message>>([]);
	const [errorGetMessage, setErrorGetMessage] = useState<boolean>(false);
	const [errorPostMessage, setErrorPostMessage] = useState<string>('');
	const [sendMessage, setSendMessage] = useState<boolean>(false);

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
			} else {
				setMessages(response.data);
			}
			setErrorGetMessage(false);
		} catch (error: any) {
			console.error(error);
			if (error.response.status === 401 || error.response.status === 500) {
				setErrorLocalStorage('unauthorized');
				navigate('/Error');
			}
			setErrorGetMessage(true);
		}
	};

	const findChannel = () => {
		listChannel.map((itemChannel) => {
			if (itemChannel.id == conversationId) {
				setChannel({...itemChannel});
			}
		});
	};

////////////////////////// SOCKET /////////////////////////////////////////////

	useEffect(() => {
		fetchListChannel();

		socket.on('update_user_channel', handleUpdateUserChannel);
		socket.on('user_join', handleUserCode);

		return () => {
			socket.off('update_user_channel');
			socket.off('user_join');
		}
	}, []);

////////////////////////// HANDLE SOCKET //////////////////////////////////////
	const handleUpdateUserChannel = (data: any) => {
		console.log('user_update');
		console.log(data);
		if (data.code === 0) {
			setListChannel((prevListChannel) => {
				let channelExists = false;

				const updatedListChannel = prevListChannel.map((itemChannel) => {
					if (itemChannel.id === data.channel.id) {
						channelExists = true;
						console.log('updated channel');
						console.log(data.channel);
						return data.channel;
					}
					return itemChannel;
				});

				if (channelExists) {
					return updatedListChannel;
				} 
				else {
					setConversationId(data.channel.id);
					return [...updatedListChannel, data.channel];
				}
			});		
		}
		setUpdateChannel((prevUpdateChannel) => prevUpdateChannel + 1);
		if (updateChannel > 10) {
			setUpdateChannel(0);
		}
		findChannel();
	};

	const handleUserCode = (data: any) => {
		console.log('user_join');
		console.log(data);
	};

	const handleMessage = (data: any) => {
		if (data.channel == conversationId) {
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
				} else if (!prevListMessage.some((message) => message.id === newItemMessage.id)) {
					return [...prevListMessage, newItemMessage];
				} else {
					return prevListMessage;
				}
			});
		}
		return;
	};

	const handleMessageCode = (data: any) => {
		console.log(data);
		setSendMessage(false);
		if (data.code == 3) {
			setErrorPostMessage('Invalid Format');
		}
		if (data.code == 0) {
			setErrorPostMessage('');
		}
	};

	const handleUpdateChannel = (data: any) => {
		console.log('HEY I CHANGE NAME : ' + data?.channel_id + " :" + conversationId);
		setListChannel((prevListChannel) =>
			prevListChannel.map((itemChannel) => {
				if (itemChannel.id === data.channel_id) {
					return {...itemChannel, name: data.name};
				}
				return itemChannel;
			})
		)
		if (data.channel_id === conversationId) {
			setChannel((prevChannel) => ({...prevChannel, name: data.name}));
		}
	};

	useEffect(() => {
		fetchListMessage();
		findChannel();
		console.log('change channel');

		socket.on('message', handleMessage);
		socket.on('message_code', handleMessageCode);
		socket.on('update_channel', handleUpdateChannel);

		return () => {
			socket.off('message');
			socket.off('message_code');
			setErrorPostMessage('');
			socket.off('update_channel');
		};
	},[conversationId, updateChannel]);

	return (
		<div className='chatPage'>
			<ErrorToken/>
			<OptionBar/>
			{isOpenSideBar && (<SideBarChat
				listChannel={listChannel}
				setConversationId={setConversationId}
			/>)}
			{isOpenCreateChannel && (<CreateChannel/>)}
			{isOpenInviteChannel && (<InviteChannel channel={channel}/>)}
			{isOpenUpdateChannel && (<ModifyChannel channel={channel}/>)}
			<div className='chat-right-page'>
				<Conversation
					listMessages={messages}
					channel={channel}
					errorGetMessage={errorGetMessage}
				/>
				<SendMessage
					conversation={conversationId}
					errorPostMessage={errorPostMessage}
					setPostMessage={setSendMessage}
					postMessage={sendMessage}
				/>
			</div>
			{isOpenListUserChannel && (<ListUserChannel channel={channel}/>)}
		</div>
	);
}

export default Chat;
