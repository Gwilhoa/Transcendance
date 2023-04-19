
import './popupChat.css'
import { useState } from 'react';
import Modal from '../profil/modal';
import CV from '../profil/CV';
import { ChangeChannel, LeaveChat } from '../chatManager';


interface showMessage {
  contain: string,
  author: string
}

function takeMessagesToBack(name:string): showMessage[] {
  const ret = [{author: "", contain:"dskdjfdddsj"}, {author:"sd ddsds", contain:"sodjgggg"},{author: "", contain:"dsvvvvvvvvvvvvvvvvkdjsj"}, {author:"s ddsds", contain:"sodjgggggggggggggggggggg"}]
  //////Bonne chance !!

    
  return (ret);
}


const sendNewMessageToBack = (message:string) => {
    //////J'me casse !!
}

const sendCommandToBack = (message:string) => {
  //////Chao !!
}

const getMessages = (chan:string, isOpen:boolean, setIsOpen: (checked: boolean) => void) => {
  const messagesRet = [];
  const listMessageGet = takeMessagesToBack(chan);

  for(let i = 0; i < listMessageGet.length; i++) {
    
    if (listMessageGet[i].author === "") {
      messagesRet.push(
        <li className="message me" key={i}>
          {listMessageGet[i].contain}
        </li>
      )
    }
    else {

      messagesRet.push(
        <li key={i}>
            {"de : "}
            <a href="#" onClick={() => setIsOpen(true)} className=""> 
              {listMessageGet[i].author}
            </a>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
              <CV name={listMessageGet[i].author} isFriend={false} isMe={false} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"}/>
            </Modal>  
            <div className="message other">
              {listMessageGet[i].contain}
            </div>
        </li>
        )
      }
    }
    return <div className="messagePannel"> {messagesRet} </div>;
  }
  
const getChanels = () => {
  var ListOfChanel:string[] = ["hdh", "sdjs", "dsdsdssddsddssdds"];
  
  //// <<<<<<<<<<<<<<<  The true list

  const chanels = [];
  for(let i = 0; i < ListOfChanel.length; i++) {
    chanels.push(
        <li className="chanel" key={i}>
          <a href={"#"} onClick={() => ChangeChannel(ListOfChanel[i])}>
            {ListOfChanel[i]}
          </a>
        </li>
    )
  } 
  return <div className="popup_list_of_chanel">{chanels}</div>
}


const PopupChat: React.FC<{path:string}> = (path) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setMessage] = useState('');

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    console.log("message", prompt);
    if (prompt.charAt(0) === "/") {
      sendCommandToBack(prompt);
    }
    else {
      sendNewMessageToBack(prompt);
    }
    
   setMessage('');
  }
  
  return (
    <div className="popup right">
      <div className="popupchild">
        <header className="popup_up">
          <button className="close-button" onClick={LeaveChat} > X </button>
          <div className="texte">
            {path.path}
          </div>
        </header>
        <div className="popup_corps">
          {getChanels()}
          <div className="messages">
            {getMessages(path.path, isOpen, setIsOpen)}
            <div className="popup_input" >
                <input type="input" placeholder="Message à envoyer"  value={prompt} onChange={handleMessageChange}></input>
                 <button type="submit" onClick={sendMessage}>
                     Envoyer
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupChat;