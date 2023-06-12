import './css/begingame.css'
import Cookies from 'universal-cookie';
import { animated, useSpring } from 'react-spring';
import React, { useEffect } from 'react';
import SocketSingleton from '../socket';
import { useNavigate } from 'react-router-dom';


const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
const cookies = new Cookies();
const BeginGame = () => {

    let gameId;
    let paddle1;
    const navigate = useNavigate();
    useEffect(() => {
        
    
        socket.emit('join_matchmaking', {token : cookies.get('jwtAuthorization')});
    
        socket.on('matchmaking_code', (data:any) => {
          if (data["code"] === 0) {
            console.log('enter matchmaking successfull');
            socket.on('found_game', (data) => {
                console.log(data);
            });
          }
          else {
            navigate("/home");
            alert("Error, you are already in game");
          }
        });
      }, []);


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