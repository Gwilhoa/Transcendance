import React, { useEffect, useState }from "react";
import './css/history.css'
// import Cookies from 'universal-cookie';
import ErrorToken, { setErrorCookie } from '../components/IfError';
import axios from '../components/utils/API'
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { cookies } from '../App'
import { off } from "process";

interface Score {
    ennemy: string;
    scoreEnnemy: number;
    scoreMe: number;
}
 

interface ShowScore {
    status: string;
    score1: string;
    score2: string;
}

const OneScoreBlock = ({status, score1, score2 }: ShowScore) => {
    return (
      <div className="score-block">
        <h3 className="status">{status}</h3>
            <div className="score">
            <div className="player">
                {/* <a href="" className="image"><img className="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img></a> */}
                <img className="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img>
                <p>{score1}</p> {/* todo: add link to profil */}
            </div>
            <p>against</p>
            <div className="player">
                {/* <a href="" className="image"><img className="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img></a> */}
                <img className="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img>
                <p>{score2}</p> {/* todo: add link to profil */}
            </div>
        </div>
      </div>
    );
};

const Add = () => {
    const blocks = [];
    const [response, setResponse] = useState<AxiosResponse | null>(null);
    // todo: change enemy here no more use

    const navigate = useNavigate();
    useEffect(() =>{
        axios.get("http://localhost:3000/game",{
            headers: {
                Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
            },
        })
        .then((res) => {
            console.log(res);
            setResponse(res.data);
        })
        .catch((error) => {
            console.error(error);
            setErrorCookie(error.response.status);
            navigate('/Error');
        })
    }, [navigate]);
    
    const ListOfScore: Score[] = [
        { ennemy: "Gchatain", scoreEnnemy: 3, scoreMe: 25 },
        { ennemy: "Dieu", scoreEnnemy: 50, scoreMe: 49 },
        { ennemy: "Xav Niel", scoreEnnemy: 0, scoreMe: 100 },
        { ennemy: "Gchatain", scoreEnnemy: 3, scoreMe: 25 },
        { ennemy: "Dieu", scoreEnnemy: 50, scoreMe: 49 },
        { ennemy: "Xav Niel", scoreEnnemy: 0, scoreMe: 100 },

      ];
    if (response == null)
      return <></>;
    let games : JSON = response;
    let game: any;
    for (game of games)
    {
        console.log('game id: ' + game.id);
    }
    ////// REMPLIR LIST OF SCORE AVEC LES VRAIS SCORES ///////////
    
    for (let i = 0; i < ListOfScore.length; i++) {
        if (ListOfScore[i].scoreMe > ListOfScore[i].scoreEnnemy) {
            blocks.push (
                <OneScoreBlock
                status={"Victory:"}
                score1={String(ListOfScore[i].scoreMe)}
                score2={String(ListOfScore[i].scoreEnnemy)}
                key={i}
                />
            )
        }
        else { 
            blocks.push (
                <OneScoreBlock
                status={"Defeat:"}
                score1={String(ListOfScore[i].scoreMe)}
                score2={String(ListOfScore[i].scoreEnnemy)}
                key={i}
                />
            )
            }
        }
        return <div className="score-board">{blocks}</div>;
}

const History = () => {
    return (
        <div className="page-history">
			<ErrorToken />
             <header className="history-title">
                <div>
                    {"Historique"}
                </div>
            </header>
            <div className="scrollBlock">
                <Add/>
            </div>
        </div>
    );
  }

  export default History;
