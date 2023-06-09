import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import Cookies from 'universal-cookie';
import { setErrorLocalStorage } from '../IfError';
const cookies = new Cookies();
axios.defaults.baseURL = process.env.REACT_APP_IP + ":3000/";
axios.defaults.headers.common = {'Authorization': `bearer ${cookies.get('jwtAuthorization')}`}
export const socket = io(process.env.REACT_APP_IP + ":3000", {
    transports: ['websocket']
});
socket.on('connect', () => {
    socket.emit('connection', { token: cookies.get('jwtAuthorization')})
});

socket.on('connection_server', (data: any) => {
    console.log(data);
});


export default axios;

