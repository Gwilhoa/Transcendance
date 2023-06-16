import './css/begingame.css'
import Cookies from 'universal-cookie';
import { animated, useSpring } from 'react-spring';
import React, { useEffect } from 'react';
import SocketSingleton from '../socket';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBeginStatus } from '../redux/game/beginToOption';
import ErrorToken from '../components/IfError';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
const cookies = new Cookies();
const BeginGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
      let gamefound = false;
      socket.emit('join_matchmaking', {token : cookies.get('jwtAuthorization')});
      
      socket.on('matchmaking_code', (data:any) => {
        console.log(data)
        if (data["code"] === 0) {
          console.log('enter matchmaking successfull');
          socket.on('game_found', (data) => {
            console.log(data);
            dispatch(setBeginStatus({decide: data.decide, playerstate: data.user, gameid: data.game_id}));
            navigate("/optiongame")            
            gamefound = true;
          });
        }
        else {
          console.log('aie aie aie')
          navigate("/home");
          alert("Error, you are already in game");
        }
      });
      
      return () => {
        if (!gamefound) {
          console.log("oui")
          socket.emit('leave_matchmaking')
        }
      };

    }, []);
    
    
    const spinnerAnimation = useSpring({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
        loop: true,
        config: { duration: 4000 },
    });

  return (
    <div className='center-page'>
        <ErrorToken />
        <h2 style={{color: 'white'}}> Searching players... </h2>
        <animated.img src={"https://pic.onlinewebfonts.com/svg/img_155544.png"} className={"gameimg"} style={spinnerAnimation}></animated.img>
    </div>
  );
}

export default BeginGame;