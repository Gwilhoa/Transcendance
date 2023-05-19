
import './popupChat.css'
import React, { ReactNode, useEffect, useState } from 'react';
import { ChangeChannel, KnowMyChannel, LeaveChat } from './chatManager';
import { Link} from 'react-router-dom';
import { Channel, Message, MessageCode, canJoinChannel, createChannel, getChannels, getMessages, socket, sendNewMessageToBack, Token, getMessage} from '../utils/API';
import '../../template/template.css';
import { useNavigate } from "react-router-dom";
import { ButtonInputToggle } from '../utils/inputButton';
import { parthMessages } from './parthMessage';
import { debug } from 'console';

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

const PopupChat: React.FC<{path:string, openModal:(param: boolean) => void, setContent:(param: ReactNode) => void}> = (param) => {
  const [title, setTitle] = useState(param.path);
  const Navigate = useNavigate();
  const [prompt, setMessage] = useState('');
  const [channelList, setChannelList] = useState<Channel[]>([])
  
  let finalPath:Channel|undefined;
  if (Array.isArray(channelList)) {
    finalPath = channelList.find((channel) => channel.name === param.path);
    if (finalPath)
      setTitle(finalPath.name);
  }
  const [messageList, setMessageList] = useState<Message []>([])
  const [dontHaveChannel, setDontHaveChannel] = useState(false);
  const [currentChanel, setCurrentChanel] = useState<number>(0);
  
  
  console.log("final path : " + finalPath);
  
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

  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessageList([ {contain:message, date:"ee", author:'ejd'}]);
    });
  
    return () => {
      socket.off('message_received');
      socket.off('channels_updated');
    };
  }, []);

  async function NewChan(name:string) {
    if (name && canJoinChannel(name)) {
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
  
  if (!finalPath && param.path != "/" && param.path != "SoloChannel" && param.path != "" && !NewChan(param.path)){
      setDontHaveChannel(true);
      setTitle('SoloChannel');
      console.log(title);
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
    //if (!dontHaveChannel)
    //  getMessage(currentChanel.toString());

    return (
      <div className="popup right">
      <div className="popupchild">
        <header className="popup_up">
          <Link to={LeaveChat()} style={{ textDecoration: 'none' }} className="close-button" > X </Link>
          <div className="texte">
            {title}
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
            {parthMessages(messageList, param.path, param.openModal, param.setContent)}
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
