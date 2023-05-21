import { Link, useNavigate } from "react-router-dom";
import './template.css'
import React, { useEffect, useState } from "react";
import CV from "../components/profil/CV";
import { Props } from "../App";
import axios, { getName } from "../components/utils/API";
import { IsInAChat, JoinChat, LeaveChat } from "../components/popup/chatManager";
import { setErrorCookie } from "../components/IfError";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Head = ({ openModal, setContent }: Props) => {
	const [name, setName] = useState<number>(0);
	const [image, setImage] = useState<string>("");
	const navigate = useNavigate();

	useEffect(() => {
		axios.get("http://localhost:3000/user", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				console.log(response);
				setName(response.data.id);
			})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
		axios.get("http://localhost:3000/user/image", {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				setErrorCookie("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}, []);

  const buttonChat = () => {
    if (IsInAChat())
      return LeaveChat();
    else
      return JoinChat();
  }

  const profilStart = () => {
    setContent(
		<CV name={getName()} 
		isFriend={false} 
		isMe={true} 
		photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"} 
		closeModal={openModal}
		/>);
    openModal(true);
  }

    return (
        <div className="navbar">
          <div className="title">
            <Link to="/home" className="navbar__link">
              <h2>
                Transcendence
              </h2>
            </Link>
          </div>
          <div className="navbar__links">
            <Link to={buttonChat()} className="navbar__link">
              Chat
            </Link>
            <Link to="/game" className="navbar__link">
              Jeu
            </Link>
            <Link to="/history" className="navbar__link">
              History
            </Link>
            <button onClick={profilStart} className="navbar__link"> 
              <h3>
                Profil
              </h3>
            </button>
          </div>
        </div>
    );
  }

  export default Head
