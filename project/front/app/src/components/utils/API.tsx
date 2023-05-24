import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { promises } from 'dns';
import { Navigate, useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import Cookies from 'universal-cookie';
import { setErrorCookie } from '../IfError';
const cookies = new Cookies();
axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.headers.common = {'Authorization': `bearer ${cookies.get('jwtAuthorization')}`}
export const socket = io('http://localhost:3000', {
    transports: ['websocket']
});
socket.on('connect', () => {
    socket.emit('connection', { token: cookies.get('jwtAuthorization')})
});

socket.on('connection_server', (data: any) => {
    console.log(data);
});

socket.on('message_code', (data: any) => {
    console.log(data.code);
})

export const Token = cookies.get('jwtAuthorization');



export default axios;

export interface Message {
    contain: string,
    author: string, 
    date: string
}

export interface Channel {
    name: string,
    id: string
}

interface Vector {
    x: number,
    y: number
}

export enum MessageCode {
    SUCCESS = 0,
    CHANNEL_NOT_FOUND = 1,
    NO_ACCESS = 2,
    INVALID_FORMAT = 3,
}
  
export enum ChannelCode {
    CHANNEL_NOT_FOUND = 1,
    NO_ACCESS = 2,
}

interface MMessage {
    token: string;
    channel_id: string;
    content: string;
}

// export function sendMessage(prompt:string, channel_id:number) {
//     
// }


export const getMessage = async (channel_id: string) => {
    const user_id = cookies.get('jwtAuthorization');
    // Émettre un événement au serveur pour demander les messages
    socket.emit('getMessages', { channel_id, user_id }, (messages: any[]) => {
      console.log('Messages récupérés :', messages);
      // Faites quelque chose avec les messages récupérés, par exemple, les mettre à jour dans le state du composant
    });
  };


export async function getMessages(channel_id:string) : Promise<Message[]> {
    
    try {
        const response = await axios.get('/channel/available');
        console.log(response.data)
        return response.data.username;
    } catch (error) {
        console.error('Error : no channel found', error);
        return [];
    }




    const config: AxiosRequestConfig = {
        method: 'get',
        url: 'http://localhost:3000/channel/message',
        params: {
          channel_id: name,
        },
        
      };

    const parseMessage = (data:AxiosResponse) => {
        console.log(data);
    }

    axios(config)
        .then(response => {
            parseMessage(response.data);
          })
    .catch(error => 
      console.error(error)
      );
    return ([{contain:cookies.get('jwtAuthorization'), author:"dfdf", date:"jfd"}]);
}


export async function getName() : Promise<string> {
  try {
      const response = await axios.get('/user/id');
      console.log(response.data)
      return response.data;
  } catch (error) {
      console.error('Error : no channel found', error);
      return "";
  }
}


export async function getChannels() : Promise<Channel[]> {
    try {
        const response = await axios.get('/channel/available');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error : no channel found', error);
        return [];
    }
}

export async function createChannel(channelName: string): Promise<boolean> {

    const channelData = {
        name: channelName,
        type: 1,
        creator_id: cookies.get('jwtAuthorization')
      };
    try {
      const response = await axios.post('/channel/create', channelData);
      console.log('Canal créé avec succès');
      return (true);
    } catch (error) {
        console.error('Erreur lors de la création du canal :', error);
        return false;
    }
}

export const sendNewMessageToBack = (channelId: string, content: string) => {
    const token = cookies.get('jwtAuthorization');

    const messageData: MMessage = {
      token, 
      channel_id: channelId,
      content,
    };

    socket.emit('send_message', messageData, (response: MessageCode) => {
      if (response === MessageCode.SUCCESS) {
        console.log('Message envoyé avec succès');
        return ;
      } else if (response === MessageCode.CHANNEL_NOT_FOUND) {
        setErrorCookie('Le canal n\'existe pas');
      } else if (response === MessageCode.NO_ACCESS) {
        setErrorCookie('Vous n\'avez pas accès à ce canal');
      } else if (response === MessageCode.INVALID_FORMAT) {
        setErrorCookie('Format invalide du message');
      }
      const Navigate = useNavigate();
      Navigate('/Error');
    });
  };

export function canJoinChannel(Channel:string) : boolean {
    return (true);
}

export async function joinChannel(str:string, nb:number) : Promise<boolean> {
    return (true);
}

export function getPositionBall() : Vector {

    return ({x:0, y:0});
}


export function getTwoFA() : boolean {
    return (true);
}

export function setTwoFA(isFa:boolean) {
    console.log(isFa);
}


export function setName(str:string) {

    return (false);
}

