import React from "react"
import { useDispatch } from "react-redux";
import { switchChatModal } from "../../redux/chat/modalChatSlice";
import { MdViewList } from "react-icons/md/index"
import "./css/optionBar.css"

const OptionBar = () => {
	const dispatch = useDispatch();

	
  return (
		<div className="chatOptionBar">
			<button 
				onClick={() => dispatch(switchChatModal())} 
				className="buttonShowModal"
			>
				<MdViewList />
			</button>
		</div>
  );
}
export default OptionBar;
