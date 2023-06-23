import {Route, Routes} from 'react-router-dom';
import Template from './template/template';
import Auth from './pages/Auth';
import NotFound from './pages/PageNotFound';
import CreateTwoFaPage from './pages/CreateTwoFa';
import Game from './pages/game';
import EndGame from './pages/endgame';
import TryToReconnect from './pages/BackError';
import Home from './pages/home';
import History from './pages/history';
import TokenPage from './pages/authenticate';
import NotTwoFa from './components/authenticate/AuthenticateComponentsNotTwoFa'
import TwoFa from './components/authenticate/AuthenticateComponentsTwoFa'
import React, {useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import Chat from './pages/chat';
import BeginGame from "./pages/begingame";
import OptionGame from "./pages/optiongame";
import axios from 'axios';
import {setErrorLocalStorage} from './components/IfError';
import { useNavigate} from 'react-router-dom';

export const cookies = new Cookies();


const AppInsideBrowser = () => {

	const [id, setId] = useState<string | null>(null);
	
	const navigate = useNavigate();
	
	useEffect(() => {
		axios.get(process.env.REACT_APP_IP + ':3000/user/id', {
			headers: {
				Authorization: `Bearer ${cookies.get('jwtAuthorization')}`,
			},
		})
			.then((response) => {
				console.log('localstorage set : id :')
				console.log(response.data.id);
				setId(response.data.id);
				console.log('id set in localstorage');
				localStorage.setItem('id', response.data.id);
				console.log(localStorage.getItem('id'))
			})
			.catch((error) => {
				setErrorLocalStorage('Error ' + error.response.status);
				console.error(error);
				navigate('/Error');
			});
	}, [navigate]);

	return (
		<>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/authenticate" Component={TokenPage}/>
				<Route path="/authenticate/NotTwoFa" Component={NotTwoFa}/>
				<Route path="/authenticate/TwoFa" Component={TwoFa}/>
				<Route path="/Error" Component={TryToReconnect}/>
				<Route path="/game" element={<Game gameId={0}/>}/>
				<Route path="/optionGame" element={<OptionGame></OptionGame>}/>
				<Route element={<Template/>}>
					<Route path="/home" element={<Home></Home>}/>
					<Route path="/chat" element={<Chat></Chat>}/>
					<Route path="/begingame/*" element={<BeginGame></BeginGame>}/>
					<Route path="/CreateTwoFa" element={<CreateTwoFaPage></CreateTwoFaPage>}/>
					<Route path="/history/:id" element={<History></History>}/>
					<Route path="/endgame/*" element={<EndGame></EndGame>}/>
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
