
import './popupChat.css'
import React, { ReactNode, useEffect, useState } from 'react';
import { ChangeChannel, LeaveChat } from './chatManager';
import { Link} from 'react-router-dom';
import { Channel, Message, canJoinChannel, createChannel, getChannels, socket, sendNewMessageToBack, getMessages} from '../utils/API';
import '../../template/template.css';
import { useNavigate } from "react-router-dom";
import { ButtonInputToggle } from '../utils/inputButton';
import { parthMessages } from './parthMessage';

type ChannelItem = {
  id: string;
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
  const [messageList, setMessageList] = useState<Message []>([])
  const [currentChanel, setCurrentChanel] = useState<string>("");
  
  const updateChannelList = () => {
    getChannels()
    .then((channels: Channel[]) => {
      console.log(channels);
      setChannelList(channels);
      if (Array.isArray(channels)) {
        const foundChannel = channels.find((channel) => channel.name === param.path);
        if (!foundChannel) {
          setCurrentChanel("");
          setMessageList([]);
          setTitle('SoloChannel');
        } else if (foundChannel) {
          console.log("channel is " + foundChannel.name)
          setMessageList([]);
          setCurrentChanel(foundChannel.id);
          setTitle(foundChannel.name);
        }
      }
    })
    .catch((error: any) => {
      console.error('Erreur lors de la récupération des canaux disponibles :', error);
    });
  };
  
  useEffect(() => {
    socket.on('message', (message: string) => {
      console.log("Guilhem me ment");
      setMessageList([ {contain:message, date:"ee", author:'ejd'}]);
    });
    return () => {
      socket.off('message_received');
      socket.off('channels_updated');
    };
  });

  useEffect(() => {
    updateChannelList()
  }, [param.path])

  async function NewChan(name:string) {
    if (name && canJoinChannel(name)) {
        const newItem:ChannelItem  = {
        id: "",
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
  

  const nChangeChannel = (name:string, id:string) => {
    //setTitle(name);
    return ChangeChannel(name);

  }

  const parthChannel = () => {
    if (Array.isArray(channelList)) {
      return (

      channelList.map(item => (
        <li className="chanel" key={item.id}>
        <Link to={nChangeChannel(item.name, item.id)}>
        {item.name}
        </Link>
      </li>
          )
        )
      )
    }
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
    if (currentChanel === "") {
      const newMessage:Message = {
        contain: prompt,
        date :"00",
        author:""
      }
      setMessageList([...messageList, newMessage]);
      setMessage('');
      return ;
    }
    if (prompt.charAt(0) === "/") {
      sendCommandToBack(prompt);
      console.log("zz")
    }
    else {
      //console.log("zz")
      //socket.emit("message", prompt)
      sendNewMessageToBack(currentChanel, prompt);
    }
    setMessage('');
  }

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
            {
              parthChannel()
            }
            
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
