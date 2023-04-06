import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from './pages/Auth';
import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import Game from './pages/game';
import Profil from './pages/profil';
import Accueil from './pages/accueil';



function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="/auth" Component={AuthToken}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/accueil" Component={Accueil} />
      			<Route path="/game" Component={Game} />
			</Routes>
		</BrowserRouter>
	);

}

export default App;
