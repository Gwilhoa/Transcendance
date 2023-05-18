import './css/game.css'
import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from 'react-spring';
import { socket } from '../components/utils/API';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const Game = () => {

  const [gameId, setGameId] = useState(0);
  const [onGame, findGame] = useState(true);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  
  const [ball, setBall] = useState({ x: 50, y: 50});
  const [paddle1, setPaddle1] = useState({ y: 42.5 });
  const [paddle2, setPaddle2] = useState({ y: 42.5 });
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinnerAnimation = useSpring({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    loop: true,
    config: { duration: 4000 },
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  
  const Height = document.documentElement.clientHeight * 0.8;
  const Width = document.documentElement.clientWidth - 802;
  
  
  

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        setPaddle1((paddle) => ({ y: (paddle.y - 1) < 0 ? 0: paddle.y - 1}));
        break;
      case "KeyS":
        setPaddle1((paddle) => ({ y: (paddle.y + 1) > 85 ? 85: paddle.y + 1}));
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

  }, []);


  const positionStyle = {
    position: "absolute",
    top: "50px",
    left: "100px",
  };

  socket.emit('join_matchmaking', cookies.get('jwtAuthorization'));

  useEffect(() => {
    socket.on('update_game', (data) => {
      setScore1(data.score1);
      setScore2(data.score2);
      setBall({x: data.ballx, y: data.bally});

      if (!onGame) {
        findGame(true);
      }
    });

    return () => {
      socket.off('update_game');
    };
  }, [onGame]);


  const inputGame = () => {
    const token = localStorage.getItem('token');
    socket.emit('input_game', { game_id: gameId, position: paddle1, token: cookies.get('jwtAuthorization')});
  };


  return (
    <>
      {!onGame && 
        <>
          <h2> Searching players... </h2>
          <p></p>
          <animated.img src={"https://pic.onlinewebfonts.com/svg/img_155544.png"} className={"gameimg"} style={spinnerAnimation}></animated.img>
        </>
      }

      {onGame && 
        <>
          <canvas
          ref={canvasRef}
          className="game-canvas"
          > </canvas>
          <div className="paddle1" style={{ top: paddle1.y + '%' }} />
          <div className="paddle2" style={{ top: paddle2.y + '%'}} />
          <div className="ball" style={{ top: ball.x + '%', left: ball.y + '%' }} />
        </>
      }
    </>
  );
}

export default Game;
