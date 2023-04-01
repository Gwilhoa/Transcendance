import { Link } from "react-router-dom";
import './template.css'

const Head = () => {
    return (
          <div className="navbar">
          <div className="title">
            <h3>Transcendence</h3>
          </div>
          <div className="navbar__links">
            <Link to="/accueil" className="navbar__link">
              Accueil
            </Link>
            <Link to="/chat" className="navbar__link">
              Chat
            </Link>
            <Link to="/game" className="navbar__link">
              Jeu
            </Link>
            <Link to="/historic" className="navbar__link">
              Historique
            </Link>
            <Link to="/profil" className="navbar__link">
              Profil
            </Link>
          </div>
          </div>
    );
  }

  export default Head