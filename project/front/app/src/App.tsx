import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Begin from './components/begin'


import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function Template(props: Props) {
  return (
    <div>
      <header>Header goes here</header>
      <main>{props.children}</main>
      <footer>Footer goes here</footer>
    </div>
  );
}



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


const Chat = () => {
	return (
		<Template>
			<h1> sfsdsfs </h1>
		</Template>

	)

}

const maBiteEstGrosse = () => {
	return (null)
}


function App() {
  return (
	<BrowserRouter>
		<Routes>
			<Route path="/" Component={Authentificate} />
			<Route path="/chat" Component={Chat} />
			<Route path="/accueil" Component={maBiteEstGrosse} />
		</Routes>
	</BrowserRouter>
  );
}

export default App;
