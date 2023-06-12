import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { socket } from '../utils/API';
import { setErrorLocalStorage } from "../IfError";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

enum UserStatus {
    CONNECTED = 0,
    IN_CONNECTION = 1,
    IN_GAME = 2,
    OFFLINE = 3,
    DISCONNECTED = 4,
}

const ProfilImage = (id : string) =>{
    const [userStatus, setUserStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setUserStatus('profil-status-disconnected');
        axios.get(process.env.REACT_APP_IP + ":3000/user/id/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
        .then((response) => {
            if (response.data.status === UserStatus.CONNECTED)
            {
                setUserStatus("profil-status-connected");
            }
            if (response.data.status === UserStatus.IN_GAME)
            {
                setUserStatus("profil-status-in-game");
            }
        })
        .catch((error) => {
            setErrorLocalStorage("Error " + error.response.status);
            console.error(error);
            navigate('/Error');
        });

        socket.on('connection_server', (data: any) => {
			console.log('status')
			if (data.connected.includes() != null){
				console.log("satus connected");
				setUserStatus('profil-status-connected');
			}
			if (data.connected.includes() != null){
				console.log("satus in game");
				setUserStatus('profil-status-in-game');
			}
			console.log(data.connected);
			console.log(data.in_game);
		})
    },[navigate, socket])

    return (
        <div key={"image"} className='profil-image'>
            <img className='circle-image' src={image} alt="selected" />
			<div className={'profil-status' + ' ' + userStatus}></div>
        </div>
    );
}