import { Link } from "react-router-dom";
import './template.css'
import { useState } from "react";
import PopupHisto from "../popup/popupHisto"
import CV from "../profil/CV";
import { Props } from "../App";
import { getName } from "../API";
import { IsInAChat, JoinChat, LeaveChat } from "../popup/chatManager";

const Head = ({ openModal, setContent }: Props) => {

  const [showPopupHisto, setShowPopupHisto] = useState(false);  
  const handlePopupCloseHisto = () => {
    setShowPopupHisto(false);
  };

  const buttonChat = () => {
    if (IsInAChat())
      return LeaveChat();
    else
      return JoinChat();
  }

  const profilStart = () => {
    setContent(<CV name={getName()} isFriend={false} isMe={true} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"} closeModal={openModal}/>);
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
            <Link to={buttonChat()} className="navbar__link">
              Chat
            </Link>
            <Link to="/game" className="navbar__link">
              Jeu
            </Link>
            <button onClick={() => setShowPopupHisto(!showPopupHisto)} className="navbar__link">
              <h3>Historique</h3>
            </button>
            {showPopupHisto && <PopupHisto onClose={handlePopupCloseHisto} />}
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