import React from "react";
import ErrorToken from "../components/IfError";
import './css/history.css'

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
    // todo: change enemy here no more use 
    const ListOfScore: Score[] = [
        { ennemy: "Gchatain", scoreEnnemy: 3, scoreMe: 25 },
        { ennemy: "Dieu", scoreEnnemy: 50, scoreMe: 49 },
        { ennemy: "Xav Niel", scoreEnnemy: 0, scoreMe: 100 },
        { ennemy: "Gchatain", scoreEnnemy: 3, scoreMe: 25 },
        { ennemy: "Dieu", scoreEnnemy: 50, scoreMe: 49 },
        { ennemy: "Xav Niel", scoreEnnemy: 0, scoreMe: 100 },

      ];
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