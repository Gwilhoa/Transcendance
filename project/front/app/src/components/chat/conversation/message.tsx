
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { cookies } from "../../../App";
import { RootState } from "../../../redux/store";
import { Message } from "../../../pages/chat"
import "../css/sidebar.css"
import SocketSingleton from "../../../socket";

function Conversation(message: Message) {
	const [isMe, setIsMe] = useState<boolean>(message.user.id == localStorage.getItem('id'));
	
	

	return (
		<>

		</>
	);
}
export default Conversation;
