import axios, { AxiosResponse } from 'axios';
const token = "775ce06e806d0bdfd9ed04e121f3f727c4be6f292470cc9b45e6335e0c7b035c";
axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.headers.common = {'Authorization': `bearer ${token}`}


export default axios;

interface Message {
    contain: string,
    author: string, 
    date: string
}

interface Channel {
    name: string,
    id: number
}

interface Vector {
    x: number,
    y: number
}

export function sendMessage(prompt:string) {
    
}

export function getMessages(name:string) : Message[] {

    const parseMessage = (data:AxiosResponse) => {
        console.log(data);
        //for (let i = 0; i < data.
    }

    axios.get('https://localhost:3000/' + name + '/message')
    .then(response => {

      parseMessage(response);
    }
      )
    .catch(error => 
      console.error(error)
      );
    return ([{contain:"sdjjd", author:"dfdf", date:"jfd"}]);
}


export function getChannels() : Channel[] {

    return ([{name:"yo", id:1}, {name:"uluberlu", id:2}]);
}


export function canJoinChannel(Channel:string) : boolean {
    return (true);
}

export function getPositionBall() : Vector {

    return ({x:0, y:0})
}