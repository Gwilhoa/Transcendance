import { useState } from "react"

import Template from "../../template/template"
import './chat.css'
import Popup from "./popup"

const Chat: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
  
    const handlePopupClose = () => {
      setShowPopup(false);
    };
    return (
        <Template>
            <h1>Mon site web</h1>
      <button onClick={() => setShowPopup(true)}>Afficher la pop-up</button>
      {showPopup && <Popup onClose={handlePopupClose} />}
      {/* ... le reste de votre application ... */}
        
        </Template>
    );
  }

  export default Chat