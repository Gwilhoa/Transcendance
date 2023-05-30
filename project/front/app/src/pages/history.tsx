import React, { useEffect, useState, useCallback }from "react";
import './css/history.css'
import ErrorToken, { setErrorLocalStorage } from '../components/IfError';
import axios from '../components/utils/API'
import { useNavigate } from 'react-router-dom';
import { cookies } from '../App'


interface ShowScore {
    status: string;
    myScore: string;
    opponentScore: string;
    opponentId : string;
}

const vistoryScore = 3;

const OneScoreBlock = ({status, myScore, opponentScore, opponentId }: ShowScore) => {
    const navigate = useNavigate();
    const [image, setImage] = useState<string>("");
    const [user1Image, setUser1Image] = useState<string>("");
    const [user2Image, setUser2Image] = useState<string>("");
    const id = localStorage.getItem('id');

	useEffect(() =>{
		axios.get("http://localhost:3000/user/image/" + id, {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				const data = response.data;
				setUser1Image(data);
			})
			.catch((error) => {
				setErrorLocalStorage("Error " + error.response.status);
				console.error(error);
				navigate('/Error');
			});
        axios.get("http://localhost:3000/user/image/" + opponentId, {
            headers: {
                Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
            },
        })
            .then((response) => {
                const data = response.data;
                setUser2Image(data);
            })
            .catch((error) => {
                setErrorLocalStorage("Error " + error.response.status);
                console.error(error);
                navigate('/Error');
            });
        }, [navigate]);

    return (
      <div className="score-block">
        <h3 className="status">{status}</h3>
            <div className="score">
            <div className="player">
                {/* <a href="" className="image"><img className="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img></a> */}
                {/* <a href={profilStart}> */}
                    <img className="image" src={user1Image}></img>
                    {/* </a> */}
                <p>{myScore}</p> {/* todo: add link to profil */}
            </div>
            <p>against</p>
            <div className="player">
                {/* <a href="" className="image"><img className="image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/1200px-42_Logo.svg.png"></img></a> */}
                <img className="image" src={user2Image}></img>
                <p>{opponentScore}</p> {/* todo: add link to profil */}
            </div>
        </div>
      </div>
    );
};

function getUserIndex(game : any)
{
    const id = localStorage.getItem('id');
    if (game.user1.id == id)
        return 1;
    return 2;
}



const Add = () => {
    const blocks = [];
    const [response, setResponse] = useState<any>(null);

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
            setErrorLocalStorage(error.response.status);
            navigate('/Error');
        })
    }, [navigate]);
    console.log("toto");
    
    if (response == null || response.length == 0)
    {
        // console.log("toto");
        return (<p className="no-game-played">{"You don't have played a game yet!"}</p>);
    }
    console.log(response)
    let i = 0;
    for (const game of response)
    {
        let status : string;
        if( game.score1 == vistoryScore && getUserIndex(game) == 1)
            status = 'Victory';
        else
            status = 'Defeat';
        let myScore : string;
        let opponentScore : string;
        let opponentId : string;
        if (getUserIndex(game) == 1)
        {
            myScore = game.score1;
            opponentScore = game.score2;
            opponentId = game.user2.id;
        }
        else
        {
            myScore = game.score2;
            opponentScore = game.score1;
            opponentId = game.user1.id;
        }
        blocks.push (
            <OneScoreBlock
            status={status + ':'}
            myScore={myScore}
            opponentScore={opponentScore}
            opponentId={opponentId}
            key={i}
            />
        )
        i++;
    }
    return <div className="score-board">{blocks}</div>;
}

const History = () => {
    console.log('aaa');
    return (
        <div className="page-history">
			<ErrorToken />
             <header className="history-title">
                <div>
                    {"Historique"}
                </div>
            </header>
            <div className="scrollBlock">
                <Add />
            </div>
        </div>
    );
  }

  export default History;
