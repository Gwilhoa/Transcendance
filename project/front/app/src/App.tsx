import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from './pages/Auth';
import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import Game from './pages/game';
import Accueil from './pages/accueil';
import { useEffect, useState } from "react";
import PopupChat from "./popup/popupChat";

function App() {
	const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (window.location.hash === '/chat') {
      setShowChat(true);
    }
  }, []);

  const handleButtonClick = () => {
    setShowChat(true);
    window.location.hash = 'chat';
  };

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="/auth" Component={AuthToken}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/accueil" Component={Accueil} />
      			<Route path="/game" Component={Game} />

				  {showChat && (
				<Route path="/chat">
					 <PopupChat/>
				</Route>
      )}
			</Routes>
		</BrowserRouter>
	);

}

export default App;
