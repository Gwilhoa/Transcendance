import './game.css'
import Template from "../template/template"
import React, { useState, useEffect, useRef } from "react";


import {createGlobalStyle} from "styled-components"

var widthCanvas:number = 1000;
var heightCanvas:number = 700;

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ball, setBall] = useState({ x: 400, y: 300, vx: 5, vy: 5 });
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
 
        
      <div /*style={positionStyle}*/>
        <div className="score-container">
          <div className="player1-score">{score1}</div>
          <div className="player2-score">{score2}</div>
        </div>
        <canvas
          ref={canvasRef}
          className="game-canvas"
          width={widthCanvas}
          height={heightCanvas}
          />
        <div className="paddle1" style={{ top: paddle1.y }} />
        <div className="paddle2" style={{ top: paddle2.y }} />
        <div className="ball" style={{ top: ball.y, left: ball.x }} />
      </div>
        </Template>
    );
}

export default Game;