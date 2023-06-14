
import '../css/sendMessageBar.css'
import React from 'react'
import {useEffect, useState} from 'react';
import SocketSingleton from '../../../socket';
import {useSelector} from 'react-redux';
import {cookies} from '../../../App';
import {RootState} from '../../../redux/store';
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

export default function SendMessage(){
	const [message, setMessage] = useState('');
	const conversation = useSelector((state: RootState) => state.conversation.id);

	const handleSendMessage = () =>
	{
		console.log('send message pls : ' + conversation);
		socket.emit('send_message', {token: cookies.get('jwtAuthorization'), channel_id: conversation , content: message});
		setMessage('');
	}

	const handleKeyDown = (event:any) => {
		if (event.key === 'Enter') {
			handleSendMessage()
		}
	};

	return (
		<div className='chat-input-send-bar'>
			<input className='chat-input-message' type='text' placeholder='Message' value={message}  onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)}/>
			<button className='chat-button-send-message' onClick={handleSendMessage}>{'>'}</button>
		</div>
	)
}
