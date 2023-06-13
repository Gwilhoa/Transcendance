import "../../css/optionBar.css"
import React from "react"
import { MdPlaylistAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { switchChatModalCreateChannel } from "../../../../redux/chat/modalChatSlice";

const ButtonCreateChannel = () => {
	const dispatch = useDispatch();

	return (
		<button 
			onClick={() => dispatch(switchChatModalCreateChannel())} 
			className="buttonShowModal"
		>
			<MdPlaylistAdd />
		</button>
	);
}

export default ButtonCreateChannel
