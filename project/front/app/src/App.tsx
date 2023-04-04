
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Game from './pages/game';
import Profil from './pages/profil';
import Template from './template/template';
import Accueil from './pages/accueil';

import './App.css';



function App() {
	//state
	//comportement
	//render
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/accueil" Component={Accueil} />
      			<Route path="/game" Component={Game} />
      			<Route path="/profil" Component={Profil} />
			</Routes>
		</BrowserRouter>
	);

}

export default App;
