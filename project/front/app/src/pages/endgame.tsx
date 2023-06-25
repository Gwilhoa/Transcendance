import './css/endgame.css'
import React, {useEffect, useRef, useState} from 'react';
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import SocketSingleton from "../socket";
import {setBeginStatus} from '../redux/game/beginToOption';
import ErrorToken from '../components/IfError';

const cookies = new Cookies();


const EndGame = () => {
  console.log("je suis la !!!");
	const myrevengeRef = useRef(false);
	const [revenge, setRevenge] = useState(false);
	const [myrevenge, setMyrevenge] = useState(false);
	const [replay, setMyReplay] = useState(true);
	const navigate = useNavigate();
	const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);
	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	const dispatch = useDispatch();

	useEffect(() => {
		return () => {
			console.log("unmount revenge : " + myrevenge);
			if (!myrevengeRef.current)
				socket.emit('game_finished', {rematch: false, token: cookies.get('jwtAuthorization')});
		};
	}, [socket]);

	const homebutton = () => {
		socket.emit('game_finished', {rematch: false, token: cookies.get('jwtAuthorization')});
		navigate('/home');
	}

	const launchReplay = () => {
		socket.emit('game_finished', {rematch: true, token: cookies.get('jwtAuthorization')});
	}

  
  const replaybutton = () => {
    myrevengeRef.current = true;
    socket.emit('game_finished', {rematch : true, token: cookies.get('jwtAuthorization')})
    if (!revenge)
      setMyrevenge(true);
  }

  useEffect(() => {

    socket.on('game_found', (data) => {
      console.log(data);
    dispatch(setBeginStatus({decide: data.decide, playerstate: data.user, gameid: data.game_id, gamestate: 1}));
    navigate("/optiongame")
  });
  
  socket.on('rematch', (any: { rematch: any; }) => {
    console.log("rematch");
    const rematch = any.rematch;
    if (rematch) {
      if (myrevenge) {
        launchReplay();
      }
      else
      setRevenge(true);
    }
    else {
      setMyReplay(false);
    }
  });
  return() => {
    socket.off('rematch')
    /*socket.off('game_found')*/
  }
  }, [])
  useEffect(() => {

    if (finalStatus == null || finalStatus.adversary == null) {
      socket.emit('leave_game', {token: cookies.get('jwtAuthorization')})
      navigate('/home');
      window.location.reload()
    }
  } , [finalStatus, navigate]);




	return (
    <>
			<ErrorToken/>
			<div className="end_game">
				<h1 className="end_game_title">{"you " + finalStatus?.status + " against " + finalStatus?.adversary}</h1>
				<div className="end_game_buttons">
					{revenge &&
                        <p>your opponent wants revenge</p>}

					{myrevenge &&
                        <p>request taken</p>}

					{replay && !myrevenge &&
                        <button className='end_game_button' onClick={replaybutton}>Replay</button>}
					<button className='end_game_button' onClick={homebutton}> Home</button>
				</div>
			</div>
		</>
	);
}

export default EndGame;
