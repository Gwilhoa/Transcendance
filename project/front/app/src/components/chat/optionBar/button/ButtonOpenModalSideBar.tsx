import '../../css/optionBar.css'
import React from 'react'
import { useDispatch } from 'react-redux';
import { switchChatModalSideBar } from '../../../../redux/chat/modalChatSlice';
import { MdViewList } from 'react-icons/md/index'

const ButtonOpenModalSideBar = () => {
	const dispatch = useDispatch();

  return (
	<div onClick={() => dispatch(switchChatModalSideBar())} className='chat-hamburger-buttton'>
			<div className='chat-hamburger-buttton-bar'></div>
			<div className='chat-hamburger-buttton-bar'></div>
			<div className='chat-hamburger-buttton-bar'></div>
	</div>
  );
}
export default ButtonOpenModalSideBar;
