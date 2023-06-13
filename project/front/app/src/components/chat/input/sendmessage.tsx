import React from "react"
import {useEffect, useState} from "react";
import SocketSingleton from "../../../socket";
import {useSelector} from "react-redux";
import {cookies} from "../../../App";
import {RootState} from "../../../redux/store";
const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

export default function SendMessage(){
	const [message, setMessage] = useState('');
	const conversation = useSelector((state: RootState) => state.conversation.id);

	function handleSendMessage()
	{
		socket.emit('send_message', {token: cookies.get('jwtAuthorization'), channel_id: conversation , content: message});
	}


	return (
		<>
			<input type="text" placeholder="Message" onChange={(e) => setMessage(e.target.value)}/>
			<button onClick={handleSendMessage}>Send</button>
		</>
	)
}
