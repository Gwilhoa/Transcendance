
import '../css/chatMessage.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cookies } from '../../../App';
import { RootState } from '../../../redux/store';
import { Message } from '../../../pages/chat'
import SocketSingleton from '../../../socket';
import { setErrorLocalStorage } from '../../IfError';
import { useNavigate } from 'react-router-dom';
import { ProfilImage } from '../../profil/ProfilImage';
import { ProfilName } from '../../profil/ProfilName';
import { openModal } from '../../../redux/modal/modalSlice';
import { imageProfil } from './conversation';

function Timer({ dateString }: {dateString: string}) {
	const [timeElipsed, setTimeElipsed] = useState<string>();

	useEffect(() => {
			const date = new Date(dateString);
			const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} at ${date
				.getHours()
				.toString()
				.padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
			setTimeElipsed(formattedDate);
	}, []);

		return (
			<>
				post on {timeElipsed}
			</>
		);
}

function Messages({ message, listImage }: { message: Message, listImage: Array<imageProfil> }) {
	const isMe: boolean = (message.user.id === localStorage.getItem('id'));
	const photo: string = listImage.find((image) => image.id === message.user.id) 
									?.image || '';

	const dispatch = useDispatch();

	return (
		<div key={message.id} className={isMe ? 'chat-my-message' : 'chat-other-message'}>
			<img 
				className='chat-message-image-profil'
				src={photo}
			/>
			<div className='chat-message-header-and-content' >
				<div className='chat-header-of-message'>
					<div className='chat-header-username' onClick={() => dispatch(openModal(message.user.id))}>
						{message.user.username}
					</div>
					<div className='chat-header-date'>
						<Timer dateString={message.date} />
					</div>
				</div>
				<div className='chat-content-message'>
					{message.content}		
				</div>
			</div>
		</div>
	);
}
export default Messages;
