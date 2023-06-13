import "../../css/optionBar.css"
import React from "react"
import { useDispatch } from "react-redux";
import { switchChatModalSideBar } from "../../../../redux/chat/modalChatSlice";
import { MdViewList } from "react-icons/md/index"

const ButtonOpenModalSideBar = () => {
	const dispatch = useDispatch();

  return (
			<button 
				onClick={() => dispatch(switchChatModalSideBar())} 
				className="buttonShowModal"
			>
				<MdViewList />
			</button>
  );
}
export default ButtonOpenModalSideBar;
