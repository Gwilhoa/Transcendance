import '../css/optionBar.css'
import React from 'react'
import ButtonOpenModalSideBar from './button/ButtonOpenModalSideBar'
import ButtonCreateChannel from './button/ButtonCreateChannel'
import ButtonInviteChannel from './button/ButtonInviteChannelModal'

const OptionBar = () => {

	
  return (
		<div className='chat-option-bar'>
			<ButtonOpenModalSideBar />
			<ButtonCreateChannel />
			<ButtonInviteChannel />
		</div>
  );
}
export default OptionBar;
