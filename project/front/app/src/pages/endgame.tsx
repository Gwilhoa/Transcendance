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
    const navigate = useNavigate();
    const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);

  const homebutton = () => {
    socket.emit('game_finished', {rematch : false});
    navigate("/home");
  }

  const replaybutton = () => {
    socket.emit('game_finished', {rematch : true})
  }

    let revenge = false;
    let replay = true;

    socket.on('rematch', (any) => {
        console.log("rematch")
        console.log(any);
    const rematch = any.rematch;
    console.log("rematch");
    console.log(rematch);
    if (rematch) {
        revenge = true;
    } else {
        replay = false;
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

            {replay &&
            <button className="end_game_button" onClick={replaybutton}>Replay</button>}

            <button className='end_game_button' onClick={homebutton}> Home</button>
        </div>
        </div>
    </>
  );
}

let revenge = false;
let replay = true;

socket.on('rematch', (any) => {
  const rematch = any.rematch;
  if (rematch) {
    revenge = true;
  } else {
    replay = false;
  }
});

export default EndGame;