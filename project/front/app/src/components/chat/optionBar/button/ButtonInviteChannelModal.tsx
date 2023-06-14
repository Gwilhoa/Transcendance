import '../../css/optionBar.css'
import React from 'react'
import { MdPlaylistAdd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { switchChatModalInviteChannel } from '../../../../redux/chat/modalChatSlice';

const ButtonInviteChannel = () => {
	const dispatch = useDispatch();

	return (
		<div className='chat-add-channel-button' onClick={() => dispatch(switchChatModalInviteChannel())}>
		</div>
	);
}

export default ButtonInviteChannel;
