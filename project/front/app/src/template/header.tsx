import { Link } from "react-router-dom";
import './template.css'
import PopupChat from "../popup/popupChat"
import { useState } from "react";
import PopupHisto from "../popup/popupHisto"


const Head = () => {
  const [showPopupChat, setShowPopupChat] = useState(false);
  
    const handlePopupCloseChat = () => {
      setShowPopupChat(false);
    };

    const [showPopupHisto, setShowPopupHisto] = useState(false);
  
    const handlePopupCloseHisto = () => {
      setShowPopupHisto(false);
    };


    return (
          <div className="navbar">
          <div className="title">
            <h3>Transcendence</h3>
          </div>
          <div className="navbar__links">
            <Link to="/accueil" className="navbar__link">
              Accueil
            </Link>
            <button onClick={() => setShowPopupChat(true)} className="navbar__link">
              <h3>Chat</h3>
            </button>
            {showPopupChat && <PopupChat onClose={handlePopupCloseChat} />}
            <Link to="/game" className="navbar__link">
              Jeu
            </Link>
            <button onClick={() => setShowPopupHisto(true)} className="navbar__link">
              <h3>Historique</h3>
            </button>
            {showPopupHisto && <PopupHisto onClose={handlePopupCloseHisto} />}
            <Link to="/profil" className="navbar__link">
              Profile
            </Link>
          </div>
          </div>
    );
  }

  export default Head