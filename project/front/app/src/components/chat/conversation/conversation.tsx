import '../css/chatMessage.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cookies } from '../../../App';
import { RootState } from '../../../redux/store';
import { Message } from '../../../pages/chat'
import SocketSingleton from '../../../socket';
import Messages from './message';
import { useNavigate } from 'react-router-dom';
import { setErrorLocalStorage } from '../../IfError';
import { setConversation } from '../../../redux/chat/conversationIdSlice';
import ButtonListChannel from '../optionBar/button/ButtonListUserModal';

export interface imageProfil {
	id: string;
	image: string;
}

function Conversation() {
	const [errorGetMessage, setErrorGetMessage] = useState<boolean>(false);
	const [listMessage, setListMessage] = useState<Array<Message>>([]);
	const [listImageProfil, setListImageProfil] = useState<Array<imageProfil>>([]);
	const [channelName, setchannelName] = useState<string>('');
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const conversationId = useSelector((state: RootState) => state.conversation.id);

	const addImageProfil = ( id: string) => {
		let add = true;

		listImageProfil.map((img) => img.id === id ? (add = false) : null)
		if (add) {
			axios.get(process.env.REACT_APP_IP + ':3000/user/image/' + id, {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					const data = response.data;
					const img: imageProfil  = {
						id: id,
						image: data,
					}
					setListImageProfil((prevList) => [...prevList, img]);
				})
				.catch((error) => {
					setErrorLocalStorage('Error ' + error.response.status);
					console.error(error);
					navigate('/Error');
				});
		}
	};

	useEffect(() => {
		listMessage.map((itemMessage) => addImageProfil(itemMessage.user.id));
	}, [listMessage]);

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
					if (error.response.status === 401 || error.response.status === 500) {
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
		let id = conversationId;

		socket.on('join_code', (data: any) => {
			console.log('join_code ' + data.code)
			console.log(data);
			id = data.channel_id
			dispatch(setConversation(data.channel_id));
			return ;
		});

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
	}, [socket, conversationId]);



	useEffect(() =>{
		if (conversationId) {
			console.log(conversationId);
			fetchMessage(conversationId);
			axios.get(process.env.REACT_APP_IP + ':3000/channel/id/' + conversationId,
				{
					headers: {
						Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
					},
				})
				.then((response) => {
					console.log(response);
					setchannelName(response.data.name)
				})
				.catch((error) => {
					console.error(error);
					if (error.response.status === 401 || error.response.status === 500) {
						setErrorLocalStorage('unauthorized');
						navigate('/Error');
					}
				});
		}
	},[conversationId]);

	return (
		<div className='chat-conversation'>
			<div className='chat-conversation-header'>
				<p>
					{channelName}
				</p>
				<ButtonListChannel />
			</div>
			{ errorGetMessage ? 
				<p className="errorGetMessage" >
					{"you can't access this channel"}
				</p> 
			: 
				<></> 
			}	
			{ (listMessage != null && listMessage.length > 0) ? 
				<div className='chat-scroll-converation'>
					{(listMessage.map((message) => (		
						<Messages 
							key={message.id} 
							message={message} 
							listImage={listImageProfil}
						/>
					)))}
				</div> : ( 
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
