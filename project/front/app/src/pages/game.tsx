import './css/game.css'
import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import ErrorToken from '../components/IfError';
import { openModal } from '../redux/modal/modalSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setFinalStatus} from '../redux/game/gameSlice';
import {RootState} from '../redux/store';
import SocketSingleton from '../socket';
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
  const [color1, setColor1] = useState('white');
  const [color2, setColor2] = useState('white');
  const dispatch = useDispatch();
  const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);


  const socketInstance = SocketSingleton.getInstance();
  const socket = socketInstance.getSocket();




  const handleKeyPress = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'KeyW':
        socket.emit('input_game', {game_id: gameId, type: 0})
        break;
      case 'KeyS':
        socket.emit('input_game', {game_id: gameId, type: 1})
        break;
      case 'ArrowUp':
        socket.emit('input_game', {game_id: gameId, type: 0})
        break;
      case 'ArrowDown':
        socket.emit('input_game', {game_id: gameId, type: 1})
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
    const socket = socketInstance.getSocket();
    window.addEventListener('keydown', handleKeyPress);

    socket.emit('join_matchmaking', {token : cookies.get('jwtAuthorization')});

    socket.on('matchmaking_code', (data:any) => {
      if (data['code'] === 0) {
        console.log('enter matchmaking successfull');
        socket.on('game_start', (code:any) => {
          gameId = (code)
          socket.emit('input_game', { game_id: gameId, position: paddle1, token: cookies.get('jwtAuthorization')});
        });
      }
      else {
        navigate('/home');
        alert('Error, you are already in game');
      }
    });
  }, []);

  socket.on('finish_game', (any) => {
    if (isCall) {
      const content = {status: any.status, adversary: any.adversary, score1: any.score1, score2: any.score2};
      dispatch(setFinalStatus(content));
      navigate('/endGame');
      isCall = !isCall;
    }
  });
  socket.on('game_found', (data) => {
    if (data.game_id == null) {
      console.log('error while game creating');
    }
    if (data.user == 1) {
      setColor1('blue');
      setColor2('red');
    } else {
      setColor2('blue');
      setColor1('red');
    }
  });

  socket.on('create_game', (any) => {
    console.log('WESH')
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
        {onGame == 0 &&
            <div className='center-page'>
              <h2 style={{color: 'white'}}> Searching players... </h2>
              <animated.img src={'https://pic.onlinewebfonts.com/svg/img_155544.png'} className={'gameimg'} style={spinnerAnimation}></animated.img>
            </div>
        }

        {onGame == 1 &&
            <>
              <canvas
                  ref={canvasRef}
                  className='game-canvas'
              > </canvas>
              <div className='parentscore'>
                <div className='score'>
                  <h1>

                    {score1 + ' | ' + score2}
                  </h1>
                </div>
              </div>
              <div className='paddle1' style={{ top: paddle1 + '%', background: color1 }} />
              <div className='paddle2' style={{ top: paddle2 + '%', background: color2 }} />
              <div className='ball' style={{ top: ball.x + '%', left: ball.y - 1 + '%'}} />
            </>
        }
      </>

  );
}





export default Game;
