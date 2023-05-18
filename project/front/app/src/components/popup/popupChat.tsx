
import './popupChat.css'
import React, { ReactNode, useEffect, useState } from 'react';
import CV from '../profil/CV';
import { ChangeChannel, IsInAChat, JoinChat, KnowMyChannel, LeaveChat } from './chatManager';
import { Link} from 'react-router-dom';
import { Channel, Message, MessageCode, canJoinChannel, createChannel, getChannels, getMessages, socket, sendNewMessageToBack, Token} from '../utils/API';
import '../../template/template.css';
import { useNavigate } from "react-router-dom";
import { ButtonInputToggle } from '../utils/inputButton';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

type ChannelItem = {
  id: number;
  URL:string
  name:string
}



//const sendNewMessageToBack = (message:string) => {
  //////J'me casse !!
//}

const sendCommandToBack = (message:string) => {
  //////Chao !!
}

const addMessages = (chan:string, setIsOpen:(param: boolean) => void, setContent:(param: ReactNode) => void) => {
  const messagesRet = [];
  const listMessageGet = getMessages(chan);
  
  const clickName = (i:number) => {
    setContent(<CV name={listMessageGet[i].author} isFriend={false} isMe={false} photoUrl={"https://www.treehugger.com/thmb/9fuOGVoJ23ZwziKRNtAEMHw8opU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/piglet-grass-dandelions-01-b21d7ef8f881496f8346dbe01859537e.jpg"} closeModal={setIsOpen}/>);
    setIsOpen(true);
  }
  
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
            <a  onClick={() => clickName(i)} className=""> 
              {listMessageGet[i].author}
            </a>
            <div className="message other">
              {listMessageGet[i].contain}
            </div>
        </li>
      )
    }
  }
  return <div className="messagePannel"> {messagesRet} </div>;
}

const PopupChat: React.FC<{path:string, openModal:(param: boolean) => void, setContent:(param: ReactNode) => void}> = (path) => {
  
  const Navigate = useNavigate();
  const [prompt, setMessage] = useState('');
  const [channelList, setChannelList] = useState<Channel[]>([])
  const [messageList, setMessageList] = useState<Message []>([])
  const [currentChanel, setCurrentChanel] = useState<number>(0);
  const finalPath = channelList.find((channel) => channel.name === path.path);
  
  
  console.log(finalPath);
  async function NewChan(name:string) {
    if (canJoinChannel(name)) {
      const newItem:ChannelItem  = {
        id: channelList.length + 1,
        name: name,
        URL: ChangeChannel(name)
      };
      if (await createChannel(name)) {
        setChannelList([...channelList, newItem]); 
        Navigate(ChangeChannel(name));
        return true
      }
    }
    return false
  }
  
  if (!finalPath && !NewChan(path.path)){
    console.log("ENTER");
      if (KnowMyChannel() === 'General')
        NewChan("General");
      else
        return (null);
    }
    
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
        sendNewMessageToBack(currentChanel, prompt);
      }
      setMessage('');
    }

    // useEffect(() => {
    //   // Écoute des événements de messages reçus
    //   socket.on('message_received', (message: string) => {
    //     //setMessageList((prevMessages) => [...prevMessages, message]);
    //   });
  
    //   // Écoute des événements de canaux mis à jour

    //   // Nettoyage lors du démontage du composant
    //   return () => {
    //     socket.off('message_received');
    //     socket.off('channels_updated');
    //   };
    // }, []);


    
    
    const updateChannelList = () => {
      getChannels()
      .then((channels: Channel[]) => {
        console.log(channels)
        setChannelList(channels);
      })
      .catch((error: any) => {
        console.error('Erreur lors de la récupération des canaux disponibles :', error);
      });
    }

    updateChannelList();

    return (
      <div className="popup right">
      <div className="popupchild">
        <header className="popup_up">
          <Link to={LeaveChat()} style={{ textDecoration: 'none' }} className="close-button" > X </Link>
          <div className="texte">
            {path.path}
          </div>
        </header>
        <div className="popup_corps">
          <div className='popup_list_of_chanel'>
            {channelList.map(item => (
              <li className="chanel" key={item.id}>
                <Link to={ChangeChannel(item.name)}>
                  {item.name}
                </Link>
              </li> 
            ))}
            
            <ButtonInputToggle
            onInputSubmit={NewChan}
            textInButton='+'
            placeHolder='ajout channel'
            classInput='button_channel'
            classButton='button_channel'/>
          </div>
          <div className="messages">
            {addMessages(path.path, path.openModal, path.setContent)}
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
