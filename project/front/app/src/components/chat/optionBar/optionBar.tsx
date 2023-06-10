import React from "react"
import ButtonOpenModalSideBar from "./button/ButtonOpenModalSideBar"
import ButtonCreateChannel from "./button/ButtonCreateChannel"
import "../css/optionBar.css"

const OptionBar = () => {

	
  return (
		<div className="chatOptionBar">
			<ButtonOpenModalSideBar />
			<ButtonCreateChannel />
		</div>
  );
}
export default OptionBar;
