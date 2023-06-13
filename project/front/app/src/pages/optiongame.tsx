import './css/optiongame.css'
import Cookies from 'universal-cookie';
import { animated, useSpring } from 'react-spring';
import React, { useEffect } from 'react';
import SocketSingleton from '../socket';
import { useNavigate } from 'react-router-dom';
import { SocketAddress } from 'net';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';


const socketInstance = SocketSingleton.getInstance();
const socket = socketInstance.getSocket();
const cookies = new Cookies();

interface OptionGameProps {
    gameId: any;
    decide: boolean;
}

const OptionGame = () => {
    const decide = useSelector((state: RootState) => state.beginToOption.decide);
    const playerstats = useSelector((state: RootState) => state.beginToOption.playerstate);
    console.log('playerstats ' + playerstats + '\ndecide ' + decide);
  return (
    <>
        { !decide &&
            <>
            <h1>
            Waiting your adversaire
            </h1>
            </>
        }

        { decide &&
            <>
            <button>
            jdsods
            </button>
            </>
        }
    </>
    );
}

export default OptionGame;