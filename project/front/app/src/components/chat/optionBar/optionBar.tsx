import '../css/optionBar.css'
import React, { Dispatch, SetStateAction } from 'react'
import ButtonOpenModalSideBar from './button/ButtonOpenModalSideBar'
import ButtonCreateChannel from './button/ButtonCreateChannel'
import ButtonResetConversationId from './button/ButtonResetConversationId'

const OptionBar = ({setId}: {setId: Dispatch<SetStateAction<string>>}) => {


	return (
		<div className='chat-option-bar'>
			<ButtonOpenModalSideBar/>
			<ButtonCreateChannel/>
			<ButtonResetConversationId setId={setId}/>
		</div>
	);
}
export default OptionBar;
