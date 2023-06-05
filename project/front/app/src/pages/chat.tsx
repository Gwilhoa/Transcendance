import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OptionBar from '../components/chat/optionBar';
import SideBarChat from '../components/chat/sidebar';
import ErrorToken from '../components/IfError';
import { RootState } from '../redux/store';
import "./css/chat.css"

function Chat() {
	const dispatch = useDispatch();
	const isOpen = useSelector((state: RootState) => state.modalChat.isOpen);

	return (
		<div className="chatPage">
			<ErrorToken />
			{isOpen && ( <SideBarChat /> )}
			<OptionBar/>
			<div className="rightPart">

			</div>
		</div>
	);
}
export default Chat;
