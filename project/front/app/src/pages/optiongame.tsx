import './css/optiongame.css'
import Cookies from 'universal-cookie';
import { animated, useSpring } from 'react-spring';
import React, { useEffect, useState } from 'react';
import SocketSingleton from '../socket';
import { useNavigate } from 'react-router-dom';
import { SocketAddress } from 'net';
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setBeginStatus } from '../redux/game/beginToOption';


const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
const cookies = new Cookies();

interface OptionGameProps {
    gameId: any;
    decide: boolean;
}

const OptionGame = () => {
    
    const navigate = useNavigate();
    const decide = useSelector((state: RootState) => state.beginToOption.decide);
    const playerstats = useSelector((state: RootState) => state.beginToOption.playerstate);
    console.log('playerstats ' + playerstats + '\ndecide ' + decide);

    const [nbBall, setNbBall] = useState('button1');
    const [nbMap, setNbMap] = useState('map1');
    const [isPowerup, setIsPowerup] = useState(false);

    const enterGame = () => {
        socket.emit('option_send', {ball:nbBall, map:nbMap, powerup: isPowerup})
    }
    
    socket.on('will_started', (data) => {
        console.log(data);
        navigate('/game');
    })

    const selectBall = (str:string) => {
        setNbBall(str)
    }

    const selectMap = (str:string) => {
        setNbMap(str)
    }

    const selectPowerUp = (power:boolean) => {
        setIsPowerup(power);
    }

  return (
    <>
        { !decide &&
            <>
            <div className='title-choice'>
            Waiting your adversaire
            </div>
            </>
        }

        { decide &&
            <>
                <div className='title-choice'>
                    choose ball
                </div>

                <div className="button-group">
                    <button
                        className={`button ${nbBall === 'button1' ? 'selected' : ''}`}
                        onClick={() => selectBall('button1')}>
                        Ball 1
                    </button>
                    <button
                        className={`button ${nbBall === 'button2' ? 'selected' : ''}`}
                        onClick={() => selectBall('button2')}>
                        Ball 2
                    </button>
                    <button
                        className={`button ${nbBall === 'button3' ? 'selected' : ''}`}
                        onClick={() => selectBall('button3')}>
                        Ball 3
                    </button>
                </div>

                <div className='title-choice'>
                    choose map
                </div>

                <div className="button-group">
                    <button
                        className={`button ${nbMap === 'map1' ? 'selected' : ''}`}
                        onClick={() => selectMap('map1')}>
                        Map 1
                    </button>
                    <button
                        className={`button ${nbMap === 'map2' ? 'selected' : ''}`}
                        onClick={() => selectMap('map2')}>
                        Map 2
                    </button>
                    <button
                        className={`button ${nbMap === 'map3' ? 'selected' : ''}`}
                        onClick={() => selectMap('map3')}>
                        Map 3
                    </button>
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