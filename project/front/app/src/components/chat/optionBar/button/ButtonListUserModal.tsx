import '../../css/optionBar.css'
import React from 'react'
import {useDispatch} from 'react-redux';
import {switchChatModalListUser} from '../../../../redux/chat/modalChatSlice';

const ButtonListChannel = () => {
	const dispatch = useDispatch();

	return (
		<p className='chat-list-users-button' onClick={() => dispatch(switchChatModalListUser())}>
			☷
		</p>
	);
}

export default ButtonListChannel;
