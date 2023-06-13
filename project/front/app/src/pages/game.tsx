import './css/game.css'
import React, { useState, useEffect, useRef } from "react";
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import ErrorToken from '../components/IfError';
import {useDispatch, useSelector} from 'react-redux';
import {setFinalStatus} from "../redux/game/gameSlice";
import {RootState} from "../redux/store";
import SocketSingleton from "../socket";
const cookies = new Cookies();

let isCall = true;

interface GameProps {
  gameId: number;
}

const Game: React.FC<GameProps> = ({ gameId }) => {
  isCall = true;
  const navigate = useNavigate();
  const [onGame, findGame] = useState(gameId);
  console.log(onGame);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const [ball, setBall] = useState({ x: 50, y: 50});
  const [paddle1, setPaddle1] = useState(42.5 );
  const [paddle2, setPaddle2] = useState(42.5 );
  const [color1, setColor1] = useState("white");
  const [color2, setColor2] = useState("white");
  
  const playerstats = useSelector((state: RootState) => state.beginToOption.playerstate);

  
  const [nbBall, setNbBall] = useState('button1');
  const [nbMap, setNbMap] = useState('map1');
  const [isPowerup, setIsPowerup] = useState(false);
  
  
  const dispatch = useDispatch();
  const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);
  
  
  const socketInstance = SocketSingleton.getInstance();
  const socket = socketInstance.getSocket();
  
  
  
  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        socket.emit("input_game", {game_id: gameId, type: 0})
        break;
      case "KeyS":
        socket.emit("input_game", {game_id: gameId, type: 1})
        break;
      case "ArrowUp":
        socket.emit("input_game", {game_id: gameId, type: 0})
        break;
      case "ArrowDown":
        socket.emit("input_game", {game_id: gameId, type: 1})
    }
  };
          
          
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    if (playerstats == 2) {
      setColor1("red")
      setColor2("blue")
    }
    else {
      setColor1("blue");
      setColor2("red")
    }
    socket.on('option_receive', (data) => {
      setNbBall(data.ball);
      setNbMap(data.map);
      setIsPowerup(data.powerup);
      console.log(data)
    })
    socket.on('game_start', (code:any) => {
      gameId = (code)
      socket.emit('input_game', { game_id: gameId, position: paddle1, token: cookies.get('jwtAuthorization')});
    });
  }, [])
    
    
    
    socket.on('finish_game', (any) => {
      if (isCall) {
      const content = {status: any.status, adversary: any.adversary, score1: any.score1, score2: any.score2};
      dispatch(setFinalStatus(content));
      navigate('/endGame');
      isCall = !isCall;
    }
  });
  
  
  socket.on('create_game', (any) => {
    console.log("WESH")
    console.log(any);
  })


  useEffect(() => {
    socket.on('update_game', (data) => {
      setScore1(data.score1);
      setScore2(data.score2);
      setBall({x: (data.ballx), y: (data.bally)});
      setPaddle2(data.rack2y)
      setPaddle1(data.rack1y);
      if (!onGame) {
        findGame(1);
      }
    });

    return () => {
      socket.off('update_game');
      socket.emit('');
    };
  }, [onGame]);

  return (
  <>
    <ErrorToken />
    <canvas
        ref={canvasRef}
        className="game-canvas"
    > </canvas>
    <div className="parentscore">
      <div className="score">
        <h1>

          {score2 + " | " + score1}
        </h1>
      </div>
    </div>
    <div className="paddle1" style={{ top: paddle1 + '%', background: color1 }} />
    <div className="paddle2" style={{ top: paddle2 + '%', background: color2 }} />
    <div className="ball" style={{ top: ball.x - 2 + '%', left: ball.y - 1 + '%'}} />
  </>

  );
}

export default Game;