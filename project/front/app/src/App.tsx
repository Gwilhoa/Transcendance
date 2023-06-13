import { Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import NotFound from './pages/PageNotFound';
import CreateTwoFaPage from './pages/CreateTwoFa';
import Game from './pages/game';
import EndGame from './pages/endgame';
import TryToReconnect from './pages/BackError';
import Home from './pages/home';
import Chat from './pages/chat';
import History from './pages/history';
import Template from './template/template';
import TokenPage from './pages/authenticate';
import NotTwoFa from './components/authenticate/AuthenticateComponentsNotTwoFa'
import TwoFa from './components/authenticate/AuthenticateComponentsTwoFa'
import React from 'react';
import Cookies from 'universal-cookie';

export const cookies = new Cookies();


const AppInsideBrowser = () => {
	return (
		<>
			<Routes>
				<Route path='/' Component={Auth}/>
				<Route path='*' Component={NotFound}/>
				<Route path='/authenticate' Component={TokenPage} />
				<Route path='/authenticate/NotTwoFa' Component={NotTwoFa} />
				<Route path='/authenticate/TwoFa' Component={TwoFa} />
				<Route path='/Error' Component={TryToReconnect} />
				<Route element={<Template/>}>
					<Route path='/home' element={<Home></Home>} />
					<Route path='/game' element={<Game gameId={0} />} />
					<Route path='/chat/*' element={<Chat></Chat>} />
					<Route path='/CreateTwoFa' element={<CreateTwoFaPage></CreateTwoFaPage>}/>
					<Route path='/history' element={<History></History>} />
					<Route path='/endgame/*' element={<EndGame></EndGame>} />
				</Route>
			</Routes>
		</>
	);
}




function App() {
	return (
			<AppInsideBrowser/>
	);

}

export default App;
