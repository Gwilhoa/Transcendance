
import axios from "axios";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { cookies } from "../../../App";
import { RootState } from "../../../redux/store";
import { Message } from "../../../pages/chat"
import "../css/sidebar.css"
import SocketSingleton from "../../../socket";
import { setErrorLocalStorage } from "../../IfError";
import { useNavigate } from "react-router-dom";
import { ProfilImage } from "../../profil/ProfilImage";

function Timer({ dateString }: {dateString: string}) {
	const [timeElipsed, setTimeElipsed] = useState<string>();

	useEffect(() => {
			const date = new Date(dateString);
			const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
				.getHours()
				.toString()
				.padStart(2, "0")}h${date.getMinutes().toString().padStart(2, "0")}`;
			setTimeElipsed(formattedDate);
	});

		return (
			<>
				post on {timeElipsed}.
			</>
		);
}

function Messages({ message }: { message: Message}) {
	const isMe: boolean = (message.user.id === localStorage.getItem('id'));

	return (
		<div key={message.id} className={isMe ? 'MyMessage' : 'OtherMessage'}>
			<div className="photoProfilMessage">
				<ProfilImage id={message.user.id} diameter='' />
			</div>
			<div className="headerMessage">
				<div className="nameMessage">
					{message.user.username}
				</div>
				<div className="dateMessage">
					<Timer dateString={message.date} />
				</div>
			</div>
			<div className="textMessage">
				{message.content}		
			</div>
			
		</div>
	);
}
export default Messages;
