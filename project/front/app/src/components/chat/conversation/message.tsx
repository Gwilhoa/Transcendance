
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

function Timer({ dateString }: {dateString: string}) {
	const [timeElipsed, setTimeElipsed] = useState<number>(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const date = new Date(dateString);
			const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
			setTimeElipsed(secondsAgo);
		}, 1000);

		return () =>{
				clearInterval(interval);
		}
	});

	
	if (timeElipsed < 60)
		return (
			<>
				Il y a {timeElipsed} s
			</>
		);

	if (timeElipsed < 3600)
		return (
			<>
				Il y a {(timeElipsed / 60).toFixed(0)} min
			</>
		);
	if (timeElipsed < 86400)
		return (
			<>
				Il y a {(timeElipsed / 3600).toFixed(0)} h
			</>
		);
	else {
		return (
			<>
				Il y a {(timeElipsed / 86400).toFixed(0)} d
			</>
		);
	}
}

function Messages({ message }: { message: Message}) {
	const isMe: boolean = (message.user.id === localStorage.getItem('id'));
	const [image, setImage] = useState<string>('');
	const navigate = useNavigate(); 

	useEffect(() => {
		axios.get(process.env.REACT_APP_IP + ":3000/user/image/" + message.user.id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setImage(data);
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	})

	return (
		<div key={message.id} className={isMe ? 'MyMessage' : 'OtherMessage'}>
			<div className="headerMessage">
				<div className="photoProfilMessage">
				</div>
				<div className="nameMessage">
					{message.user.username}
				</div>
			</div>

			<div className="textMessage">
				{message.content}		
			</div>
			
			<div className="dateMessage">
				<Timer dateString={message.date} />
			</div>
		</div>
	);
}
export default Messages;
