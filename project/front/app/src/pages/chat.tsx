import "./css/chat.css"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Conversation from '../components/chat/conversation/conversation';
import CreateChannel from '../components/chat/createChannel/CreateChannel';
import OptionBar from '../components/chat/optionBar/optionBar';
import SideBarChat from '../components/chat/sidebar';
import ErrorToken from '../components/IfError';
import { RootState } from '../redux/store';
import SendMessage from "../components/chat/input/sendmessage";
import { setConversation } from '../redux/chat/conversationIdSlice';

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
	pwd: string | null;
	users: Array<User>;
}

export interface Message {
	content: string;
	date: string;
	id: string;
	user: User;
}

function Chat() {
	const dispatch = useDispatch();
	const isOpenSideBar = useSelector((state: RootState) => state.modalChat.isOpenSideBar);
	const isOpenCreateChannel = useSelector((state: RootState) => state.modalChat.isOpenCreateChannel);
	const conversationId = useSelector((state: RootState) => state.conversation.id);
	if (conversationId === '' && localStorage.getItem('conversationId') != '') {
		dispatch(setConversation('' + localStorage.getItem('conversationId')));
	}

	return (
		<div className="chatPage">
			<ErrorToken />
			{isOpenSideBar && ( <SideBarChat /> )}
			{isOpenCreateChannel && ( <CreateChannel /> )}
			<OptionBar/>
			<div className="rightPart">
				<Conversation />
				<SendMessage />
			</div>
		</div>
	);
}
export default Chat;
