import React, { Dispatch, SetStateAction } from 'react'

const ButtonResetConversationId = ({setId}: {setId: Dispatch<SetStateAction<string>>}) => {

	const handleOnClick = () => {
		setId('');
	};

	return (
		<div className='chat-reset-button' onClick={() => handleOnClick()}>
			RESET
		</div>
	)
};

export default ButtonResetConversationId;
