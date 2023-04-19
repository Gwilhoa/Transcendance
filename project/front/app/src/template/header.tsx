import { Link } from "react-router-dom";
import './template.css'
import { useState } from "react";
import Modal from "../profil/modal";
import PopupHisto from "../popup/popupHisto"
import CV from "../profil/CV";
import { JoinChat } from "../chatManager";

const Head = () => {

  const [showPopupHisto, setShowPopupHisto] = useState(false);  
  const handlePopupCloseHisto = () => {
    setShowPopupHisto(false);
  };

  const [isOpen, setIsOpen] = useState(false)


    return (
        <div className="navbar">
          <div className="title">
            <h3>Transcendence</h3>
          </div>
          <div className="navbar__links">
            <Link to="/accueil" className="navbar__link">
              Accueil
            </Link>
            <button onClick={JoinChat} className="navbar__link">
              <h3>Chat</h3>
            </button>
            <Link to="/game" className="navbar__link">
              Jeu
            </Link>
            <button onClick={() => setShowPopupHisto(true)} className="navbar__link">
              <h3>Historique</h3>
            </button>
            {showPopupHisto && <PopupHisto onClose={handlePopupCloseHisto} />}
            <button onClick={() => setIsOpen(true)} className="navbar__link"> 
              <h3>
                Profil
              </h3>
            </button>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
              <CV name={"Pigi16"} isFriend={false} isMe={true} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"}/>
            </Modal>
          </div>
        </div>
    );
  }

  export default Head