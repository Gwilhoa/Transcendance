import '../../css/optionBar.css'
import React from 'react'
import { MdPlaylistAdd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import {switchChatModalInviteChannel, switchChatModalUpdateChannel} from '../../../../redux/chat/modalChatSlice';

const ButtonUpdateChannel = () => {
	const dispatch = useDispatch();

	return (
		<div className='chat-add-channel-button' onClick={() => dispatch(switchChatModalUpdateChannel())}>
		</div>
	);
}

export default ButtonUpdateChannel;
