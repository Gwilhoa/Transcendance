import './css/optiongame.css'
import './css/game.css'
import Cookies from 'universal-cookie';
import {animated, useSpring} from 'react-spring';
import React, {useEffect, useState} from 'react';
import SocketSingleton from '../socket';
import {useNavigate} from 'react-router-dom';
import {RootState} from '../redux/store';
import {useSelector} from 'react-redux';

import Ball1 from '../images/game/ball/Ball1.png';
import Ball2 from '../images/game/ball/Ball2.webp';
import Ball3 from '../images/game/ball/Ball3.jpg';

import Map1 from '../images/game/map/Map1.png';
import Map2 from '../images/game/map/Map2.webp';
import Map3 from '../images/game/map/Map3.png';

const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
const cookies = new Cookies();


const OptionGame = () => {

	const spinnerAnimationBall = useSpring({
		from: {transform: 'rotate(0deg)'},
		to: {transform: 'rotate(360deg)'},
		loop: true,
		config: {duration: 4000},
	});
	const navigate = useNavigate();
	const decide = useSelector((state: RootState) => state.beginToOption.decide);
	const playerstats = useSelector((state: RootState) => state.beginToOption.playerstate);
	const hasproblem = useSelector((state: RootState) => state.beginToOption.gameid);
	useEffect(() => {
		if (hasproblem == null)
			navigate('/home');
		return () => {
			socket.off('will_started');
		}
	}, [])
	console.log('playerstats ' + playerstats + '\ndecide ' + decide);

	const [nbBall, setNbBall] = useState(Ball1);
	const [nbMap, setNbMap] = useState(Map1);
	const [isPowerup, setIsPowerup] = useState(false);

	const enterGame = () => {
		socket.emit('option_send', {ball: nbBall, map: nbMap, powerup: isPowerup})
	}

	socket.on('will_started', (data) => {
		console.log(data);
		navigate('/game');
	})

	const selectBall = (str: string) => {
		setNbBall(str)
	}

	const selectMap = (str: string) => {
		setNbMap(str)
	}

	const selectPowerUp = (power: boolean) => {
		setIsPowerup(power);
	}

	return (
		<>
			{!decide &&
                <>
                    <div className='game-waiting-settings'>
                        Waiting your opponent to choose settings...
                    </div>
                </>
			}

			{decide &&
                <>
                    <div className='title-choice'>
                        choose ball
                    </div>

                    <div className="button-group">
                        <button
                            className={`button ${nbBall === Ball1 ? 'selected' : ''}`}
                            onClick={() => selectBall(Ball1)}>
                            Ball 1
                        </button>
                        <button
                            className={`button ${nbBall === Ball2 ? 'selected' : ''}`}
                            onClick={() => selectBall(Ball2)}>
                            Ball 2
                        </button>
                        <button
                            className={`button ${nbBall === Ball3 ? 'selected' : ''}`}
                            onClick={() => selectBall(Ball3)}>
                            Ball 3
                        </button>
                    </div>
                    <div className='img'>
                        <animated.img src={nbBall} className={"ball"} style={spinnerAnimationBall}></animated.img>
                    </div>

                    <div className='title-choice'>
                        choose map
                    </div>

                    <div className="button-group">
                        <button
                            className={`button ${nbMap === Map1 ? 'selected' : ''}`}
                            onClick={() => selectMap(Map1)}>
                            Map 1
                        </button>
                        <button
                            className={`button ${nbMap === Map2 ? 'selected' : ''}`}
                            onClick={() => selectMap(Map2)}>
                            Map 2
                        </button>
                        <button
                            className={`button ${nbMap === Map3 ? 'selected' : ''}`}
                            onClick={() => selectMap(Map3)}>
                            Map 3
                        </button>
                    </div>

                    <div className='img'>
                        <img src={nbMap} width={300} height={200}/>
                    </div>

                    <div className='title-choice'>
                        choose if powerup
                    </div>

                    <div className="button-group">
                        <button
                            className={`button ${isPowerup === false ? 'selected' : ''}`}
                            onClick={() => selectPowerUp(false)}>
                            no powerup
                        </button>
                        <button
                            className={`button ${isPowerup === true ? 'selected' : ''}`}
                            onClick={() => selectPowerUp(true)}>
                            powerup
                        </button>
                    </div>

                    <button className='enter' onClick={enterGame}>
                        confirm
                    </button>
                </>
			}
		</>
	);
}

export default OptionGame;