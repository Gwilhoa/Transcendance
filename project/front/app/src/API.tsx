import React, { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { bigToken } from './pages/authenticate';
axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.headers.common = {'Authorization': `bearer ${bigToken}`}


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
    
    const config: AxiosRequestConfig = {
        method: 'get',
        url: 'https://localhost:3000/channel/message',
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

// export function getJwt(url:string, token:string) : string {
// 	const [accessToken, setAccessToken] = useState("");
// 	axios.get(url, {
// 			headers: {
// 				Authorization: `Bearer ${token}`,
// 			},
// 		})
// 			.then((response) => {
// 				setAccessToken(response.data.access_token);
// 			})
// 			.catch((error) => {
// 				console.error(error);
// 				setAccessToken(error);
// 			});
// 	return (accessToken);
// }
