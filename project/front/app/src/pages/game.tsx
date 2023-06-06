import './css/game.css'
import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from 'react-spring';
import { socket } from '../components/utils/API';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();

let isCall = true;

const Game = () => {
  isCall = true;
  const navigate = useNavigate();
  const [onGame, findGame] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  
  const [ball, setBall] = useState({ x: 50, y: 50});
  const [paddle1, setPaddle1] = useState(42.5 );
  const [paddle2, setPaddle2] = useState(42.5 );
  const [finalScore, setFinalScore] = useState("");


  
  let gameId = 0;

  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        socket.emit("input_game", {game_id: gameId, type: 0})
        break;
      case "KeyS":
        socket.emit("input_game", {game_id: gameId, type: 1})
        break;
    }
  };


  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spinnerAnimation = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    loop: true,
    config: { duration: 4000 },
  });

  

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    socket.emit('join_matchmaking', {token : cookies.get('jwtAuthorization')});

    socket.on('matchmaking_code', (data:any) => {
      console.log(data);
      
      if (data["code"] === 0) {
        console.log('enter matchmaking successfull');
        socket.on('game_start', (code:any) => {
          console.log(code);
          console.log("join game")
          gameId = (code)
          console.log("code")
          console.log(gameId);
          socket.emit('input_game', { game_id: gameId, position: paddle1, token: cookies.get('jwtAuthorization')});
        });
      }
      else {
        navigate("/home");
        alert("Error, you are already in game");
      }
    });
  }, []);
  
  socket.on('finish_game', (any) => {
    if (isCall) {

      setFinalScore(any.status);
      console.log("dzjj")
      navigate('/endGame')
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
      {onGame == 0 && 
        <>
          <h2 style={{color: 'white'}}> Searching players... </h2>
          <p></p>
          <animated.img src={"https://pic.onlinewebfonts.com/svg/img_155544.png"} className={"gameimg"} style={spinnerAnimation}></animated.img>
        </>
      }

      {onGame == 1 && 
        <>
          <canvas
          ref={canvasRef}
          className="game-canvas"
          > </canvas>
          <div className="parentscore">
            <div className="score">
              <h1>

              {score1 + " | " + score2} 
              </h1>
            </div>
          </div>
          <div className="paddle1" style={{ top: paddle1 + '%' }} />
          <div className="paddle2" style={{ top: paddle2 + '%'}} />
          <div className="ball" style={{ top: ball.x + '%', left: ball.y + '%'}} />
        </>
      }
    </>

  );
}





export default Game;