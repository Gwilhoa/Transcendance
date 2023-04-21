import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from './pages/Auth';
import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import Game from './pages/game';
import Accueil from './pages/accueil';
import PopupChat from "./popup/popupChat";
import { DynamicIsInAChat, KnowMyChannel } from "./chatManager";



const AppInsideBrowser = () => {

	return (
			<>
				<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="/auth" Component={AuthToken}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/accueil/*" Component={Accueil} />
				<Route path="/game/*" Component={Game} />
				
				</Routes>
				{DynamicIsInAChat() && 
					<PopupChat path={KnowMyChannel()}/>
				}
			</>

	);
}




function App() {


	return (
		<BrowserRouter>
		<AppInsideBrowser/>
		</BrowserRouter>
	);

}

export default App;
