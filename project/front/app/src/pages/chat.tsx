import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Conversation from '../components/chat/conversation';
import OptionBar from '../components/chat/optionBar/optionBar';
import SideBarChat from '../components/chat/sidebar';
import ErrorToken from '../components/IfError';
import { RootState } from '../redux/store';
import "./css/chat.css"

export interface User {
	id: string;
	email: string;
	username: string;
	enabled2FA: boolean;
	experience: number;
	status: number;
}

export interface Channel {
	id: string;
	name: string;
	topic: string | null;
	type: number;
	pwd: string;
	users: Array<User>;
}
function Chat() {
	const isOpen = useSelector((state: RootState) => state.modalChat.isOpen);

	return (
		<div className="chatPage">
			<ErrorToken />
			{isOpen && ( <SideBarChat /> )}
			<OptionBar/>
			<div className="rightPart">
			<Conversation />
			</div>
		</div>
	);
}
export default Chat;
