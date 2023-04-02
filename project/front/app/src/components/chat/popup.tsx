import React from "react";
import './chat'

type PopupProps = {
  onClose: () => void;
};

interface showMessage {
  contain: string,
  author: string
}

const getChanels = () => {
  var ListOfChanel:string[] = ["hdh", "sdjs", "dsdsdssddsddssdds"];

  const chanels = [];
  for(let i = 0; i < ListOfChanel.length; i++) {
    chanels.push(
        <div className="chanel">
          {ListOfChanel[i]}
        </div>
    )
  } 
  return <div className="bo">{chanels}</div>
}

const Popup: React.FC<PopupProps> = ({ onClose }) => {


  return (
    <div className="popup">
        <header className="popup_up">
          <button className="close-button" onClick={onClose}> X </button>
          <div className="texte">
            Chat
          </div>
        </header>
        <div className="popup_corps">
          <div className="popup_list_of_chanel">
              {getChanels()}
          </div>
          <div className="messages">
            <div className="messagePannel">
                uu  
            </div>
            <div className="popup_input" >
                <input type="input" placeholder="Message à envoyer" className="input__box"></input>
                 <button className="input__submit" type="submit">
                     Envoyer
               </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Popup;