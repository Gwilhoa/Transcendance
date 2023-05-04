import '../components/game.css'
import Template from "../template/template"
import React, { useState, useEffect, useRef } from "react";




const Game = () => {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
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




  const canvasRef = useRef<HTMLCanvasElement>(null);
  const Height = document.documentElement.clientHeight * 0.8;
  const Width = document.documentElement.clientWidth - 802;
  const [ball, setBall] = useState({ x: 50, y: 50});
  const [paddle1, setPaddle1] = useState({ y: 42.5 });
  const [paddle2, setPaddle2] = useState({ y: 42.5 });
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

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
   

    return (
      <>
    
          <canvas
            ref={canvasRef}
            className="game-canvas"
            >

            </canvas>
          <div className="paddle1" style={{ top: paddle1.y + '%' }} />
          <div className="paddle2" style={{ top: paddle2.y + '%'}} />
          <div className="ball" style={{ top: ball.x + '%', left: ball.y + '%' }} />
      </>
    );
}

export default Game;
/*<div className='sco'>
  <div className="player1-score">{score1}</div>
  <div className="player2-score">{score2}</div>
</div>*/