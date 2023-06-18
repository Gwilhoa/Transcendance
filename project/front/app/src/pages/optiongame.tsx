import './css/optiongame.css'
import './css/game.css'
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



const OptionGame = () => {
    
    const spinnerAnimationBall = useSpring({
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
        loop: true,
        config: { duration: 4000 },
    });
    const navigate = useNavigate();
    const decide = useSelector((state: RootState) => state.beginToOption.decide);
    const playerstats = useSelector((state: RootState) => state.beginToOption.playerstate);
    const couille = useSelector((state: RootState) => state.beginToOption.gameid);
    useEffect(() => {
        if (couille == null)
        navigate('/home');
        
        
        socket.on('will_started', (data) => {
            console.log(data);
            navigate('/game');
        })

        return () => {
            socket.off('will_started');
        }
        
    }, [])
    console.log('playerstats ' + playerstats + '\ndecide ' + decide);

    const Ball1 = "https://s2.qwant.com/thumbr/0x380/6/6/6f4c8d9426e69610d320350bc3fabc62de2332249a7491f1b39bdac0998bd0/soccer-ball-drawing-easy-39.png?u=http%3A%2F%2Fgetdrawings.com%2Fimages%2Fsoccer-ball-drawing-easy-39.png&q=0&b=1&p=0&a=0";
    const Ball2 = "https://s2.qwant.com/thumbr/0x380/5/4/ba9cbaaa0553bca855a0ab68fe16a30ee10c0c4dc615f57d429e87bc25e88d/pngtree-cartoon-sheep-vector-design-png-image_3576531.jpg?u=https%3A%2F%2Fpng.pngtree.com%2Fpng-clipart%2F20190516%2Foriginal%2Fpngtree-cartoon-sheep-vector-design-png-image_3576531.jpg&q=0&b=1&p=0&a=0"
    const Ball3 = "https://s2.qwant.com/thumbr/0x380/e/2/9078a58c5a46961b378e163c017b256eaf321459251b0bd15b85cc1370c874/Anonymous_Beach_ball.png?u=https%3A%2F%2Fpublicdomainvectors.org%2Fphotos%2FAnonymous_Beach_ball.png&q=0&b=1&p=0&a=0"

    const Map1 = "https://s1.qwant.com/thumbr/0x380/a/b/e6e74cb56ea71ccd8f3d72a7e9651d524bc0577e65194bbeab2d698a458ee7/c713b5b38f5f6c84d144e2adff2e4efc.jpg?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fc7%2F13%2Fb5%2Fc713b5b38f5f6c84d144e2adff2e4efc.jpg&q=0&b=1&p=0&a=0";
    const Map2 = "https://s2.qwant.com/thumbr/0x380/f/d/4aa7e3d157ea26514f10e46e10ad44ada6ab9a53de25c4fbbba4c33467acf8/pngtree-neon-error-404-page-png-image_943920.jpg?u=https%3A%2F%2Fpng.pngtree.com%2Fpng-clipart%2F20190419%2Fourlarge%2Fpngtree-neon-error-404-page-png-image_943920.jpg&q=0&b=1&p=0&a=0";
    const Map3 = "https://s1.qwant.com/thumbr/0x380/a/2/d61274a02a570816fe863dcfdbdd9ac535f0f9ade18aed36a2bf7d6c79231e/karl-marx-portrait-billboard-1548-compressed.jpg?u=https%3A%2F%2Fstatic.billboard.com%2Ffiles%2Fmedia%2Fkarl-marx-portrait-billboard-1548-compressed.jpg&q=0&b=1&p=0&a=0";

    const [nbBall, setNbBall] = useState(Ball1);
    const [nbMap, setNbMap] = useState(Map1);
    const [isPowerup, setIsPowerup] = useState(false);

    const enterGame = () => {
        socket.emit('option_send', {ball:nbBall, map:nbMap, powerup: isPowerup})
    }
    

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