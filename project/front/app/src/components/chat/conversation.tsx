import axios from "axios";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { cookies } from "../../App";
import { RootState } from "../../redux/store";
import "./css/sidebar.css"

function Conversation() {
	const conversationId = useSelector((state: RootState) => state.conversation.id);

	useEffect(() =>{
		console.log(conversationId);
		axios.get(process.env.REACT_APP_IP + ':3000/channel/message/' + conversationId,
				{
					headers: {
						Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
					},
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.error(error);
				});
	},[conversationId])

	return (
		<div className="chatConversation">
		</div>
	);
}
export default Conversation;
