import './css/game.css'
import React, {useEffect, useRef, useState} from "react";
import Cookies from 'universal-cookie';
import {useNavigate} from 'react-router-dom';
import ErrorToken from '../components/IfError';
import {useDispatch, useSelector} from 'react-redux';
import {setFinalStatus} from "../redux/game/gameSlice";
import {RootState} from "../redux/store";
import SocketSingleton from "../socket";
import {animated, useSpring} from 'react-spring';

const cookies = new Cookies();


interface GameProps {
	gameId: number;
}

const Game: React.FC<GameProps> = () => {
	const animatedBall = useSpring({
		from: { transform: 'rotate(0deg)' },
		to: { transform: 'rotate(360deg)' },
		loop: true,
		config: { duration: 4000 },
	});

	let packageNumber = 0;

	const navigate = useNavigate();
	const gameId = useSelector((state: RootState) => state.beginToOption.gameid);

	const canPress = useRef(false);
	const [ball, setBall] = useState({x: 50, y: 50});
	const [paddle1, setPaddle1] = useState(42.5);
	const [paddle2, setPaddle2] = useState(42.5);
	const [color1, setColor1] = useState("white");
	const [color2, setColor2] = useState("white");
	const [started, setStarted] = useState("");

	const playerstats = useSelector((state: RootState) => state.beginToOption.playerstate);


	const [nbBall, setNbBall] = useState('button1');
	const [nbMap, setNbMap] = useState('map1');
	const [isPowerup, setIsPowerup] = useState(false);

	const [stop, setStop] = useState(false);
	const [timeStop, setTimeStop] = useState(60);
	const dispatch = useDispatch();
	const finalStatus = useSelector((state: RootState) => state.finalGame.finalStatus);
	const [IamStoper, setIamStoper] = useState(false);

	const socketInstance = SocketSingleton.getInstance();
	const socket = socketInstance.getSocket();
	const gamestate = useSelector((state: RootState) => state.beginToOption.gamestate);

	const ballStyles = {
		top: `${ball.x - 2}%`,
		left: `${ball.y - 1}%`,
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (!canPress.current)
			return;
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
						case "ArrowDown":
							socket.emit("input_game", {game_id: gameId, type: 1})
							break;
							case "Escape":
								socket.emit("input_game", {game_id: gameId, type: 2})
								break;
								case "KeyA":
									socket.emit("input_game", {game_id: gameId, type: 3})
									break;
									case "KeyQ":
				socket.emit("input_game", {game_id: gameId, type: 4})
				break;
				case "KeyF":
					socket.emit("input_game", {game_id: gameId, type: 5})
				break;
		}
	};

	const leaveGame = () => {
		window.location.reload()
	}

	const resumeGame = () => {
		socket.emit("input_game", {game_id: gameId, type: 2})
	}

	socket.on('create_game', (any) => {
		console.log('WESH')
		console.log(any);
	})

	socket.on('will_started', (data) => {
		if (data.time == 0) {
			canPress.current = true;
			setStarted("0 | 0");
		} else {
			setStarted(data.time);
		}
	});


	useEffect(() => {
		let isCall = true;
		if (gamestate != 2) {
			socket.emit('leave_game');
			navigate('/home')
		}
		window.addEventListener("keydown", handleKeyPress);
		if (playerstats == 2) {
			setColor1("#ff5e33")
			setColor2("#2d53ff")
		} else {
			setColor1("#2d53ff");
			setColor2("#ff5e33")
		}
		socket.on('option_receive', (data) => {
			setNbBall(data.ball);
			setNbMap(data.map);
			setIsPowerup(data.powerup);
			console.log(data)
		})

		socket.on('game_start', () => {
			socket.emit('input_game', {game_id: gameId, position: paddle1, token: cookies.get('jwtAuthorization')});
		})

		socket.on('stop_game', (any) => {

			console.log(any);
			setTimeStop(any.time);
		})

		socket.on('is_stop_game', (any) => {
			console.log(any);
			setStop(any.stop);

			setIamStoper(any.stoper);
			console.log(any.stoper);
			console.log(IamStoper);
		})

		socket.on('update_game', (data) => {
			if (data.package > packageNumber) {
				setStarted(data.score2 + " | " + data.score1)
				packageNumber = data.package;
				console.log (data.ballx, data.bally);
				data.ballx += 1;
				if(data.ballx > 100) {
					data.ballx = 100
				}
				setBall({x: (data.ballx), y: (data.bally)});
				setPaddle2(data.rack2y)
				setPaddle1(data.rack1y);
			}
		});

		socket.on('finish_game', (any) => {
			console.log(any)
			if (isCall) {
				const content = {
					status: any.status,
					adversary: any.adversary,
					score1: any.score1,
					score2: any.score2,
					gameid: gameId
				};
				dispatch(setFinalStatus(content));
				socket.off('finish_game');
				navigate('/endGame');
				isCall = !isCall;
			}
		});


			return () => {
        socket.off('update_game');
        socket.off('game_start');
        /*socket.off('is_stop_game');
        socket.off('stop_game');
        socket.off('option_receive');
        socket.off('create_game');*/
        //leaveGame();

		};
	}, []);

	return (
		<>

			<ErrorToken/>
			<img className="fill" src={nbMap}/>
			<div className="parentscore">
				<div className="score">
					<h1>
						{started}
					</h1>
				</div>
			</div>
			<div className="paddle1" style={{top: paddle1 + '%', background: color1}}/>
			<div className="paddle2" style={{top: paddle2 + '%', background: color2}}/>
			<animated.img
				src={nbBall}
				className="ball"
				style={{...animatedBall, ...ballStyles}}/>
			{stop &&
                <div className="backgroundimg">
					{IamStoper &&
                        <button className='buttonResume' onClick={resumeGame}>
                            <h1>
                                resume
                            </h1>
                        </button>
					}
                    <button className='buttonLeave' onClick={leaveGame}>
                        <h1>
                            Leave
                        </h1>
                    </button>
                    <div className='textTime'>

                        <h1>
							{timeStop}
                        </h1>
                    </div>
                </div>}
		</>

	);
}

export default Game;