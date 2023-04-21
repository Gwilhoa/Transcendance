import '../components/game.css'
import Template from "../template/template"
import React, { useState, useEffect, useRef } from "react";




const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const Height = document.documentElement.clientHeight * 0.8;
  const Width = document.documentElement.clientWidth - 800;
  const [ball, setBall] = useState({ x: Width/2, y: Height/2, vx: 5, vy: 5 });
  const [paddle1, setPaddle1] = useState({ y: 250 });
  const [paddle2, setPaddle2] = useState({ y: 250 });
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
        setPaddle1((paddle) => ({ y: paddle.y - 10 }));
        break;
      case "KeyS":
        setPaddle1((paddle) => ({ y: paddle.y + 10 }));
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);}, []);


    const positionStyle = {
        position: "absolute",
        top: "50px",
        left: "100px",
      };

    return (
      <Template>
        <div className='game-container'>
          <canvas
            ref={canvasRef}
            className="game-canvas"
            width={Width}
            height={Height}
            />
          <div className="paddle1" style={{ top: paddle1.y }} />
          <div className="paddle2" style={{ top: paddle2.y }} />
          <div className="ball" style={{ top: ball.y, left: ball.x }} />
        </div>
        </Template>
    );
}

export default Game;
/*<div className='sco'>
  <div className="player1-score">{score1}</div>
  <div className="player2-score">{score2}</div>
</div>*/