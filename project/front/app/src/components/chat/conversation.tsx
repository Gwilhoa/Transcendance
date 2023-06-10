import axios from "axios";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { cookies } from "../../App";
import { RootState } from "../../redux/store";
import { socket } from "../utils/API";
import { Message } from "../../pages/chat"
import "./css/sidebar.css"

function Conversation() {
	const conversationId = useSelector((state: RootState) => state.conversation.id);
	const [listMessage, setListMessage] = useState<Array<Message>>([]);
	
	useEffect(() => {	
		socket.on('message_code', (data: any) => {
			console.log(data);
		});
	}, [socket])

	useEffect(() =>{
		if (conversationId) {
			console.log(conversationId);
			socket.emit('send_message', {token: cookies.get("jwtAuthorization"), channel_id: conversationId, content: "test"});
			axios.get(process.env.REACT_APP_IP + ':3000/channel/message/' + conversationId,
					{
						headers: {
							Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
						},
					})
					.then((response) => {
						console.log(response);
						setListMessage(response.data);
					})
					.catch((error) => {
						console.error(error);
					});
		}
	},[conversationId])

	return (
		<div className="chatConversation">
			{listMessage.map((message) => (
			<p key={message.id}>{message.content}</p>
			))}

		</div>
	);
}
export default Conversation;
