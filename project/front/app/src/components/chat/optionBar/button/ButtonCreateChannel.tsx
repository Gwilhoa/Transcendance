import '../../css/optionBar.css'
import React from 'react'
import { MdPlaylistAdd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { switchChatModalCreateChannel } from '../../../../redux/chat/modalChatSlice';

const ButtonCreateChannel = () => {
	const dispatch = useDispatch();

	return (
		<div className='chat-add-channel-button' onClick={() => dispatch(switchChatModalCreateChannel())}>
		</div>
	);
}

export default ButtonCreateChannel
