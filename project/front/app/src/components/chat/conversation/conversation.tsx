import '../css/chatMessage.css'
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react'
import {cookies} from '../../../App';
import {Channel, Message} from '../../../pages/chat'
import Messages from './message';
import {useNavigate} from 'react-router-dom';
import {setErrorLocalStorage} from '../../IfError';
import ButtonListChannel from '../optionBar/button/ButtonListUserModal';

export interface imageProfil {
	id: string;
	image: string;
}


function Conversation(
	{listMessages, channel, errorGetMessage}:
		{ listMessages: Array<Message>, channel: Channel, errorGetMessage: boolean }) {
	const [listImageProfil, setListImageProfil] = useState<Array<imageProfil>>([]);
	const navigate = useNavigate();
	const scrollRef = useRef(null);

	useEffect(() => {
		listMessages.map((itemMessage) => addImageProfil(itemMessage.user.id));
		scrollToBottom();
	}, [listMessages]);

	const scrollToBottom = () => {
		if (scrollRef.current) {
			(scrollRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' });
		}
	};

	const addImageProfil = (id: string) => {
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
					const img: imageProfil = {
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

	return (
		<div className='chat-conversation'>
			<div className='chat-conversation-header'>
				{errorGetMessage ?
					<p className="chat-error-get-message">
						{"you can't access this channel"}
					</p>
					: 
						<>
							<p className='chat-conversation-channel-name'>
								{channel.name}
							</p>
							<ButtonListChannel/>
						</>	
				}
			</div>
			{(listMessages != null && listMessages.length > 0) ?
				<div className='chat-scroll-converation'>
					{/* <div> */}

					{(listMessages.map((message) => (
						<Messages
						key={message.id}
						message={message}
						listImage={listImageProfil}
						/>
						)))}
					<div ref={scrollRef} />
				</div> : (
					channel.id != '' && !errorGetMessage ? (
						<p className="chat-conversation-write-the-first-message">
							no message on the channel, write the first one
						</p>
					) : (
						null
					)
				)}
		</div>
	);
}

export default Conversation;
