
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
// import Game from './components/game';
// import Profil from './components/profil';
// import Template from './template/template';
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
			</Routes>
		</BrowserRouter>
	);

}

export default App;
