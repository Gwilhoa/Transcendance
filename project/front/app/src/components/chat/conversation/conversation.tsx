import '../css/sidebar.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { cookies } from '../../../App';
import { RootState } from '../../../redux/store';
import { Message } from '../../../pages/chat'
import SocketSingleton from '../../../socket';
import Messages from './message';
import { useNavigate } from 'react-router-dom';
import { setErrorLocalStorage } from '../../IfError';

function Conversation() {
	const [errorGetMessage, setErrorGetMessage] = useState<boolean>(false);
	const conversationId = useSelector((state: RootState) => state.conversation.id);
	const [listMessage, setListMessage] = useState<Array<Message>>([]);
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	const navigate = useNavigate();

	const fetchMessage = (id: string) => {
		setErrorGetMessage(false);
		axios.get(process.env.REACT_APP_IP + ':3000/channel/message/' + id,
				{
					headers: {
						Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
					},
				})
				.then((response) => {
					console.log(response);
					if (response.status === 204) {
						setListMessage([]);
					}
					else {
						setListMessage(response.data);
					}
				})
				.catch((error) => {
					console.error(error);
					if (error.response.status === 401) {
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
					}
					else {
						setListMessage([]);
						setErrorGetMessage(true);
					}
				});
		}

	useEffect(() => {	
		const id = conversationId;

		socket.on('message_code', (data: any) => {
			console.log('message_code' + data.code);
			return ;
		});

		socket.on('message', (data: any) => {
			console.log('receive message ' + id + ' ' + data.channel);
			console.log(data)
			if (data.channel === id) {
				const newItemMessage: Message = {
					content: data.content,
					id: data.id,
					user: data.user,
					date: data.date,
				}
				console.log(newItemMessage);
				setListMessage((prevListMessage) => {
					if (prevListMessage.length === 0) {
						console.log("here lenght 0");
						return [newItemMessage];
					} 
					else if (!prevListMessage.some((message) => message.id === newItemMessage.id)) {
						console.log("here new message");
						return [...prevListMessage, newItemMessage];
					}
					else {
						console.log("here prevlist");
						return prevListMessage;
					}
				});
			}
			return ;
		});
	}, [socket]);



	useEffect(() =>{
		if (conversationId) {
			console.log(conversationId);
			fetchMessage(conversationId);
		}
	},[conversationId]);

	return (
		<div className='chatConversation'>
			{ errorGetMessage ? 
				<p className="errorGetMessage" >
					{"you can't access this channel"}
				</p> 
			: 
				<></> 
			}
			{ (listMessage != null && listMessage.length > 0) ?
				(listMessage.map((message) => (
				<Messages key={message.id} message={message} />
			))) : ( 
				conversationId == '' ? (
					<p className="NeverJoinChannel">
						{"you don't have access to any channel"}
					</p>
				) : ( 
					<p className="writeTheFirstMessage">
						no message on the channel, wirte the first one
					</p>
				)
			)}
		</div>
	);
}
export default Conversation;
