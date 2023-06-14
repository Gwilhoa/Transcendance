
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

function Timer({ dateString }: {dateString: string}) {
	const [timeElipsed, setTimeElipsed] = useState<string>();

	useEffect(() => {
			const date = new Date(dateString);
			const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
				.getHours()
				.toString()
				.padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
			setTimeElipsed(formattedDate);
	}, []);

		return (
			<>
				post on {timeElipsed}.
			</>
		);
}

function Messages({ message }: { message: Message}) {
	const isMe: boolean = (message.user.id === localStorage.getItem('id'));
	const dispatch = useDispatch();

	return (
		<div key={message.id} className={isMe ? 'chat-my-message' : 'chat-other-message'}>
			<div className='chat-header-message'>
			<ProfilImage id = {'' + message.user.id} OnClickOpenProfil={true} OverwriteClassName = 'chat-message-image-profil'/>
				<div className='nameMessage'>
					<ProfilName id={message.user.id} />
				</div>
				<div className='chat-date-message'>
					<Timer dateString={message.date} />
				</div>
			</div>
			<div className='textMessage'>
				{message.content}		
			</div>
		</div>
	);
}
export default Messages;
