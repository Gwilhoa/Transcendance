import './css/begingame.css'
import Cookies from 'universal-cookie';
import { animated, useSpring } from 'react-spring';
import React from 'react';
import SocketSingleton from '../socket';


const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();

const BeginGame = () => {



    socket.on('found_game', (data) => {
        console.log(data);
    });

    const spinnerAnimation = useSpring({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
        loop: true,
        config: { duration: 4000 },
    });



  return (
    <div className='center-page'>
        <h2 style={{color: 'white'}}> Searching players... </h2>
        <animated.img src={"https://pic.onlinewebfonts.com/svg/img_155544.png"} className={"gameimg"} style={spinnerAnimation}></animated.img>
    </div>
  );
}

export default BeginGame;