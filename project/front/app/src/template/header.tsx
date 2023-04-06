import { Link } from "react-router-dom";
import './template.css'
import PopupChat from "../popup/popupChat"
import { useState } from "react";
import Modal from "../profil/modal";
import PopupHisto from "../popup/popupHisto"
import CV from "../profil/CV";


const Head = () => {
  const [showPopupChat, setShowPopupChat] = useState(false);
  const handlePopupCloseChat = () => {
    setShowPopupChat(false);
  };

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