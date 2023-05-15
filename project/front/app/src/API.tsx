import React, { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
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

interface Channel {
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


export function getChannels() : Channel[] {

    return ([{name:"yo", id:1}, {name:"uluberlu", id:2}]);
}


export function canJoinChannel(Channel:string) : boolean {
    return (true);
}

export function getPositionBall() : Vector {

    return ({x:0, y:0})
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

