
import './popupChat.css'
import { useState } from 'react';
import Modal from '../profil/modal';
import CV from '../profil/CV';
import { ChangeChannel, JoinChat, LeaveChat } from './chatManager';
import { Link, Navigate } from 'react-router-dom';
import { canJoinChannel, getMessages } from '../API';
import '../template/template.css';
import { useNavigate } from "react-router-dom";

type ChannelItem = {
  id: number;
  URL:string
  name:string
}


const sendNewMessageToBack = (message:string) => {
    //////J'me casse !!
}

const sendCommandToBack = (message:string) => {
  //////Chao !!
}

const addMessages = (chan:string, isOpen:boolean, setIsOpen: (checked: boolean) => void) => {
  const messagesRet = [];
  const listMessageGet = getMessages(chan);

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
            <a  onClick={() => setIsOpen(true)} className=""> 
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
  
  
  
const PopupChat: React.FC<{path:string}> = (path) => {

  let Navigate = useNavigate();
    const [buttonAddChannel, setButtonChannel] = useState(true)
    const [channelList, setChannelList] = useState<ChannelItem[]>([])
    const [channelPrompt, changeChannelPrompt] = useState("");

    const finalPath = channelList.find((channel) => channel.name === path.path);

    
    const NewChan = (name:string) => {
      if (canJoinChannel(name)) {
        const newItem:ChannelItem  = {
          id: channelList.length + 1,
          name: name,
          URL: ChangeChannel(name)
        };
        setChannelList([...channelList, newItem]); 
        Navigate(ChangeChannel(name));
        return true
      }
      return false
    }

    if (!finalPath && !NewChan(path.path))
    {
      Navigate(JoinChat());
    }
    
    const handleChannelKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && channelPrompt.length > 0) {
        NewChan(channelPrompt);
        changeChannelPrompt("")
        ConvertButton()
      }
    };

    const ChannelPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const alphaNumRegex = /^[a-zA-Z0-9]*$/;
      if (alphaNumRegex.test(event.target.value)) {
        changeChannelPrompt(event.target.value);
      }
    }

    const ConvertButton = () => {
      setButtonChannel(!buttonAddChannel);
    }


  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setMessage] = useState('');

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
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
          <Link to={LeaveChat()} className="close-button" > X </Link>
          <div className="texte">
            {path.path}
          </div>
        </header>
        <div className="popup_corps">
          <div className='popup_list_of_chanel'>
            {channelList.map(item => (
              <li className="chanel" key={item.id}>
                <Link to={item.URL}>
                  {item.name}
                </Link>
              </li> 
            ))}

          { buttonAddChannel &&
            <button className='button_channel' onClick={ConvertButton}>
            +
            </button>}
          { !buttonAddChannel
             &&
           <input className='button_channel'
                  type='text'
                  placeholder='ajout channel'
                  onKeyDown={handleChannelKeyDown}
                  value={channelPrompt}
                  onChange={ChannelPromptChange}
                  maxLength={10}/>}

          </div>
          <div className="messages">
            {addMessages(path.path, isOpen, setIsOpen)}
            <div className="popup_input" >
                <input 
                  type="input" 
                  placeholder="Message à envoyer"
                  value={prompt}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyPress}
                  maxLength={144}/>
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