import { BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Template from './template/template'
import Game from './components/game'
import Profil from './components/profil'

const Authentificate = () => {
    return (<div className="App">
    <div>
        <header>
            <h1>
                Transcendence
            </h1>
        </header>
        <a
        className="App-link"
        href="http://localhost:6200/auth/login"
        target="_blank"
        rel="noopener noreferrer"
        >
            Authentification
        </a>
    </div>
    </div>)
};


const maBiteEstGrosse = () => {
	return (
		<Template>
			<h1> Bite </h1>
		</Template>

	)
}


function App() {
  return (
	<BrowserRouter>
		<Routes>
			<Route path="/" Component={Authentificate} />
			<Route path="/accueil" Component={maBiteEstGrosse} />
      <Route path="/game" Component={Game} />
      <Route path="/profil" Component={Profil} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;
