import { Link } from "react-router-dom";
import './template.css'
import React from "react";
import CV from "../profil/CV";
import { MyComponentProps } from "../App";
import { getName } from "../API";

const Head = ({ openModal, setContent }: MyComponentProps) => {
  const profilStart = () => {
    setContent(<CV name={getName()} isFriend={false} isMe={true} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"}/>);
    openModal(true);
  }

    return (
        <div className="navbar">
          <div className="title">
            <h3>Transcendence</h3>
          </div>
          <div className="navbar__links">
            <Link to="/accueil" className="navbar__link">
              Accueil
            </Link>

            <Link to={"chat"} className="navbar__link">
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
