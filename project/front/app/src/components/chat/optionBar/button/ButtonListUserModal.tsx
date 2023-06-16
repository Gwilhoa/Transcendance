import '../../css/optionBar.css'
import React from 'react'
import { useDispatch } from 'react-redux';
import { switchChatModalListUser } from '../../../../redux/chat/modalChatSlice';

const ButtonListChannel = () => {
	const dispatch = useDispatch();

	return (
		<div className='chat-side-bar-channel-invite' onClick={() => dispatch(switchChatModalListUser())}>
		⚙
		</div>
	);
}

export default ButtonListChannel;
