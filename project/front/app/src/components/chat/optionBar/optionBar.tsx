import '../css/optionBar.css'
import React from 'react'
import ButtonOpenModalSideBar from './button/ButtonOpenModalSideBar'
import ButtonCreateChannel from './button/ButtonCreateChannel'
import ButtonInviteChannel from './button/ButtonInviteChannelModal'
import ButtonUpdateChannel from "./button/ButtonUpdateChannel";

const OptionBar = () => {

	
  return (
		<div className='chat-option-bar'>
			<ButtonOpenModalSideBar />
			<ButtonCreateChannel />
			<ButtonInviteChannel />
			<ButtonUpdateChannel />
		</div>
  );
}
export default OptionBar;
