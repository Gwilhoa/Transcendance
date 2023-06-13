import './css/endgame.css'
import React, { useState, useEffect, useRef } from "react";
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import SocketSingleton from "../socket";
import { setBeginStatus } from '../redux/game/beginToOption';
import ErrorToken from '../components/IfError';

const cookies = new Cookies();


const EndGame = () => {
  const myrevengeRef = useRef(false);
  const [revenge, setRevenge] = useState(false);
  const [myrevenge, setMyrevenge] = useState(false);
  const [replay, setMyReplay] = useState(true);
  const navigate = useNavigate();
  const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);
  const socketInstance = SocketSingleton.getInstance();
  const socket = socketInstance.getSocket();
  const dispatch = useDispatch();

  socket.on('message_code', (data: any) => {
    console.log(data);
  });

  useEffect(() => {
    return () => {
      console.log("unmount revenge : " + myrevenge);

      if (!myrevengeRef.current)
        socket.emit('game_finished', { rematch: false });
    };
  }, [socket]);

  const homebutton = () => {
    socket.emit('game_finished', {rematch : false});
    navigate("/home");
  }

  const launchReplay = () => {
    socket.emit('game_finished', {rematch : true});
  }

  socket.on('game_found', (data) => {
    console.log(data);
    dispatch(setBeginStatus({decide: data.decide, playerstate: data.user, gameid: data.game_id}));
    navigate("/optiongame")
  });

  const replaybutton = () => {
    myrevengeRef.current = true;
    socket.emit('game_finished', {rematch : true})
    if (revenge) {
      launchReplay();
    }
    else
      setMyrevenge(true);
  }

    socket.on('rematch', (any: { rematch: any; }) => {
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

  useEffect(() => {
    if (finalStatus == null) {
      navigate("/home");
    }
  } , [finalStatus, navigate]);



  return (
    <>
    
    <ErrorToken />
    <div className="end_game">
        <h1 className="end_game_title">{"you " + finalStatus?.status + " against " + finalStatus?.adversary}</h1>
        <div className="end_game_buttons">
            {revenge &&
            <p>ton adversaire veut une revenche</p>}

            {myrevenge &&
            <p>demande prise en compte</p>}

            {replay && !myrevenge &&
            <button className="end_game_button" onClick={replaybutton}>Replay</button>}
            <button className='end_game_button' onClick={homebutton}> Home</button>
        </div>
        </div>
    </>
  );
}

export default EndGame;