import './css/endgame.css'
import React, { useState, useEffect, useRef } from "react";
import { socket } from '../components/utils/API';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

const cookies = new Cookies();


const EndGame = () => {
  const [revenge, setRevenge] = useState(false);
  const [myrevenge, setMyrevenge] = useState(false);
  const [replay, setMyReplay] = useState(true);
  const navigate = useNavigate();
  const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);

  useEffect(() => {
    return () => {
      socket.emit('game_finished', { rematch: false });
    };
  }, []);

  const homebutton = () => {
    socket.emit('game_finished', {rematch : false});
    navigate("/home");
  }

  const replaybutton = () => {
    socket.emit('game_finished', {rematch : true})
    if (revenge) {
      navigate("/game", {state:{gameID:1}})
    }
    else
      setMyrevenge(true);
  }

    socket.on('rematch', (any) => {
    console.log("rematch")
    console.log(any);
    const rematch = any.rematch;
    console.log("rematch");
    console.log(rematch);
    if (rematch) {
      console.log("b")
      if (myrevenge) {
        console.log("a")
        socket.emit('game_finished', {rematch : true});
        navigate("/game", {state:{gameID:1}})
      }
      else
        setRevenge(true);
    }
    else {
        setMyReplay(false);
    }
    });

    if (finalStatus == null) {
        navigate("/home");
    }

  return (
    <>  
    <div className="end_game">
        <h1 className="end_game_title">{"you " + finalStatus.status + " against " + finalStatus.adversary}</h1>
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