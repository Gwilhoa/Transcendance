import "../css/optionBar.css"
import React from "react"
import ButtonOpenModalSideBar from "./button/ButtonOpenModalSideBar"
import ButtonCreateChannel from "./button/ButtonCreateChannel"

const OptionBar = () => {

	
  return (
		<div className="chatOptionBar">
			<ButtonOpenModalSideBar />
			<ButtonCreateChannel />
		</div>
  );
}
export default OptionBar;
