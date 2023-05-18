import React from "react";
import './css/history.css'

interface Score {
    ennemy: string;
    scoreEnnemy: number;
    scoreMe: number;
}
 

interface ShowScore {
    text: string;
    score1: string;
    score2: string;
}

const OneScoreBlock = ({text, score1, score2 }: ShowScore) => {
    return (
      <div className="score-block">
        <div className="score-text">{text}</div>
        <div className="score">{score1 + " - " + score2}</div>
      </div>
    );
};

const Add = () => {
    const blocks = [];
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
                text={"Victoire contre " + ListOfScore[i].ennemy}
                score1={String(ListOfScore[i].scoreMe)}
                score2={String(ListOfScore[i].scoreEnnemy)}
                key={i}
                />
            )
        }
        else { 
            blocks.push (
                <OneScoreBlock
                text={"Tu es faible face à " + ListOfScore[i].ennemy}
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
             <header className="history-title">
                <div className="texte">
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
