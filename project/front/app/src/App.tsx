import React, { useEffect, useState } from 'react';
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


function GetTokenUser(props: { url: string }) {
  const [body, setBody] = useState<string | null>(null);

  useEffect(() => {
    fetch(props.url)
      .then((response) => response.text())
      .then((text) => setBody(text));
  }, []);

  if (!body) {
    return <div>Loading...</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}

function App() {
  return (

	<div className="App">
		<h1>Transcendence</h1>
		<a
		className="api42-link"
		href="http://localhost:6200/auth/login"
		target="_blank"
		rel="noopener noreferrer"
		>
			Authentification
		</a>
			<GetTokenUser url="http://localhost:6200/auth/login"/>
    </div>

  );
//    return (
//<<<<<<< front
//	<div className="App">
//		<h1>Transcendence</h1>
//		<a
//		className="api42-link"
//		href="http://localhost:6200/auth/login"
//		target="_blank"
//		rel="noopener noreferrer"
//		>
//			Authentification
//		</a>
//			<GetTokenUser url="http://localhost:6200/auth/login"/>
//    </div>
//=======
//	<BrowserRouter>
//		<Routes>
//			<Route path="/" Component={Authentificate} />
//			<Route path="/accueil" Component={maBiteEstGrosse} />
//      <Route path="/game" Component={Game} />
//      <Route path="/profil" Component={Profil} />
//		</Routes>
//	</BrowserRouter>
//>>>>>>> main
//  );
}

export default App;
