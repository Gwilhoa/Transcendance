
import './popupChat.css'
import { useState } from 'react';
import Modal from '../profil/modal';
import CV from '../profil/CV';

type PopupProps = {
  onClose: () => void;
};

interface channelsDesc {
  name: string,
  listMessage: showMessage[]
}

interface showMessage {
  contain: string,
  author: string
}

const takeMessagesToBack = (channelName:string) => {
  ChannelDescriptor.name = channelName;
  //////Bonne chance !!
}

const sendNewMessageToBack = (message:string) => {
    //////J'me casse !!
}

const sendCommandToBack = (message:string) => {
  //////Chao !!
}

const getMessages = (chan:channelsDesc, isOpen:boolean, setIsOpen: (checked: boolean) => void) => {
  const messagesRet = [];
  for(let i = 0; i < chan.listMessage.length; i++) {
    
    if (chan.listMessage[i].author === "") {
      messagesRet.push(
        <div className="message me">
          {chan.listMessage[i].contain}
        </div>
      )
    }
    else {

      messagesRet.push(
        <div>
            {"de : "}
            <a href="#" onClick={() => setIsOpen(true)} className=""> 
            
                {chan.listMessage[i].author}
          
            </a>
            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
              <CV name={chan.listMessage[i].author} isFriend={false} isMe={false} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"}/>
            </Modal>  
        <div className="message other">
          {chan.listMessage[i].contain}
        </div>
        </div>
        )
      }
    }
    return <div className="messagePannel"> {messagesRet} </div>;
  }
  
var ChannelDescriptor:channelsDesc = {name:"Salon", listMessage: [{author: "", contain:"dskdjsj"}, {author:"s ddsds", contain:"sodjgggg"},{author: "", contain:"dsvvvvvvvvvvvvvvvvkdjsj"}, {author:"s ddsds", contain:"sodjgggggggggggggggggggg"}]}

const getChanels = () => {
  var ListOfChanel:string[] = ["hdh", "sdjs", "dsdsdssddsddssdds"];
  
  //// <<<<<<<<<<<<<<<  The true list

  const chanels = [];
  for(let i = 0; i < ListOfChanel.length; i++) {
    chanels.push(
        <div className="chanel">
          <a href={"#a"} onClick={() => takeMessagesToBack(ListOfChanel[i])}>
            {ListOfChanel[i]}
          </a>
        </div>
    )
  } 
  return <div className="popup_list_of_chanel">{chanels}</div>
}


const PopupChat: React.FC<PopupProps> = ({ onClose }) => {
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
    ChannelDescriptor.listMessage.push({author: "", contain: prompt})
    setMessage('');
  }
  
  return (
    <div className="popup right">
      <div className="popupchild">
        <header className="popup_up">
          <button className="close-button" onClick={onClose}> X </button>
          <div className="texte">
            {ChannelDescriptor.name}
          </div>
        </header>
        <div className="popup_corps">
          {getChanels()}
          <div className="messages">
            {getMessages(ChannelDescriptor, isOpen, setIsOpen)}
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