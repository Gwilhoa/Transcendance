import { Link, useNavigate } from "react-router-dom";
import './template.css'
import React, { useEffect, useState } from "react";
import CV from "../components/profil/CV";
import { Props } from "../App";
import axios from "../components/utils/API";
import { IsInAChat, JoinChat, LeaveChat } from "../components/popup/chatManager";
import { setErrorLocalStorage } from "../components/IfError";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Head = ({ openModal, setContent }: Props) => {
	const [id, setId] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('id') === null) {
			axios.get("http://localhost:3000/user/id", {
				headers: {
					Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
				},
			})
				.then((response) => {
					setId(response.data.id);
					localStorage.setItem('id', response.data.id);
				})
				.catch((error) => {
					setErrorLocalStorage("Error " + error.response.status);
					console.error(error);
					navigate('/Error');
				});
		}
		else {
			setId(localStorage.getItem('id'));	
		}
	}, [navigate]);

  const buttonChat = () => {
    if (IsInAChat())
      return LeaveChat();
    else
      return JoinChat();
  }

  const profilStart = () => {
    setContent(
		<CV id={id}
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
            <Link to='/history' className="navbar__link">
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
