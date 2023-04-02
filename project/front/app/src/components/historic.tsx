import Template from "../template/template"
import './historic.css'
import styled from "styled-components";

interface ContainerProps {
  maxHeight?: number;
}


const Container = styled.div<ContainerProps>`
  max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}px` : 'auto')};
  overflow-y: auto;
`;

interface Props {
  children: React.ReactNode;
  maxHeight?: number;
}

const ScrollableContainer: React.FC<Props> = ({ children, maxHeight }) => {
  return <Container maxHeight={maxHeight}>{children}</Container>;
};


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
    var ListOfScore: Score[] = [
        { ennemy: "Gchatain", scoreEnnemy: 3, scoreMe: 25 },
        { ennemy: "Dieu", scoreEnnemy: 50, scoreMe: 49 },
        { ennemy: "Xav Niel", scoreEnnemy: 0, scoreMe: 100 },
        { ennemy: "Gchatain", scoreEnnemy: 3, scoreMe: 25 },
        { ennemy: "Dieu", scoreEnnemy: 50, scoreMe: 49 },
        { ennemy: "Xav Niel", scoreEnnemy: 0, scoreMe: 100 },

      ];;
    
    for (let i = 0; i < ListOfScore.length; i++) {
        if (ListOfScore[i].scoreMe > ListOfScore[i].scoreEnnemy) {
            blocks.push (
                <OneScoreBlock
                text={"Victoire contre " + ListOfScore[i].ennemy}
                score1={String(ListOfScore[i].scoreMe)}
                score2={String(ListOfScore[i].scoreEnnemy)}
                />
            )
        }
        else { 
            blocks.push (
                <OneScoreBlock
                text={"Tu es faible face à " + ListOfScore[i].ennemy}
                score1={String(ListOfScore[i].scoreMe)}
                score2={String(ListOfScore[i].scoreEnnemy)}
                />
            )
            }
        }
        return <div className="score-board">{blocks}</div>;
}

const Historic = () => {
    return (
        <Template>
            <div className="scrollBlock">
                <Add/>
            </div>
        </Template>
    );
  }

  export default Historic