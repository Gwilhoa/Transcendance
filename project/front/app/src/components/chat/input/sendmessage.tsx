import '../css/sendMessageBar.css'
import React, {Dispatch, SetStateAction, useState} from 'react'
import SocketSingleton from '../../../socket';
import {cookies} from '../../../App';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

const SendMessage = ({
						 conversation,
						 errorPostMessage,
						 setPostMessage,
						 postMessage
					 }: {
	conversation: string,
	errorPostMessage: string,
	setPostMessage: Dispatch<SetStateAction<boolean>>,
	postMessage: boolean,
}) => {
	const [message, setMessage] = useState<string>('');
	const [timer, setTimer] = useState<boolean>(false);

	const handleSendMessage = () => {
		console.log('send message pls : ' + conversation);
		socket.emit('send_message', {
			token: cookies.get('jwtAuthorization'),
			channel_id: conversation,
			content: message
		});
		setMessage('');
		setTimer(false);
		setPostMessage(true);

		setTimeout(() => {
			if (postMessage)
				setTimer(true);
		}, 2000);
	}

	const handleKeyDown = (event: any) => {
		if (event.key === 'Enter') {
			handleSendMessage();
		}
	};

	return (
		<div className='chat-bottom-input'>
			<div className='chat-input-send-bar'>
				<input className='chat-input-message' type='text' placeholder='Message' value={message}
					   onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)}/>
				<button className='chat-button-send-message' onClick={handleSendMessage}>{'>'}</button>
				{errorPostMessage != '' ? <div className='chat-error-post-message'>{errorPostMessage}</div> : null}
				{postMessage && timer ?
					<div className='chat-error-post-message'>message not send try to reconnect</div> : null}
			</div>
		</div>
	)
}

export default SendMessage;
