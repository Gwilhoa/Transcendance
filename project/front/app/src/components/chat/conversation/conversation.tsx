import axios from "axios";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { cookies } from "../../../App";
import { RootState } from "../../../redux/store";
import { Message } from "../../../pages/chat"
import "../css/sidebar.css"
import SocketSingleton from "../../../socket";
import Messages from "./message";

function Conversation() {
	const conversationId = useSelector((state: RootState) => state.conversation.id);
	const [listMessage, setListMessage] = useState<Array<Message>>([]);
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();

	useEffect(() => {	

		socket.on('message_code', (data: any) => {
			console.log("send message code : " + data.code);
		});

		socket.on('message', (data: any) => {
			console.log('receive message ' + conversationId + " " + data.channel);
			console.log(data);
			if (data.channel === conversationId) {
				const newItemMessage: Message = {
					content: data.content,
					id: data.id,
					user: data.user,
					date: data.date,
				}
				console.log(newItemMessage);
				setListMessage(prevListMessage => [...prevListMessage, newItemMessage]);
			}
		});

	}, [socket])

	useEffect(() =>{
		if (conversationId) {
			console.log(conversationId);
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
			{ (listMessage != null && listMessage.length > 0) ?

				(listMessage.map((message) => (
				<Messages key={message.id} message={message} />
			))) : (<></>)
			}

		</div>
	);
}
export default Conversation;
