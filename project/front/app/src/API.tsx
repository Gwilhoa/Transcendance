import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { promises } from 'dns';
import io from "socket.io-client";
import Cookies from 'universal-cookie';
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


export default axios;

interface Message {
    contain: string,
    author: string, 
    date: string
}

export interface Channel {
    name: string,
    id: number
}

interface Vector {
    x: number,
    y: number
}

export function sendMessage(prompt:string, channel_id:number) {
    
}

export function getMessages(name:string) : Message[] {
    
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


export async function getChannels() : Promise<Channel[]> {
    createChannel("dsds")
    try {
        const response = await axios.get('/channel/available');
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error : no channel found', error);
        return [];
    }
}

export async function createChannel(channelName: string): Promise<void> {

    const channelData = {
        name: 'Moncanal',
        type: 1,
        creator_id: cookies.get('jwtAuthorization'),
      };
    try {
      const response = await axios.post('/channel/create', channelData);
      console.log('Canal créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du canal :', error);
    }
}

export function canJoinChannel(Channel:string) : boolean {
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

export function getName() : string {
    return ("Pigi16")
}

export function setName(str:string) {

    return (false);
}

