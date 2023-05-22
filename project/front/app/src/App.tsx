import {Route, Routes, useNavigate} from "react-router-dom";
import Auth from './pages/Auth';
// import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import CreateTwoFaPage from './pages/CreateTwoFa';
import Game from './pages/game';
import TryToReconnect from './pages/TryToReconnect';
import Home from './pages/home';
import History from './pages/history';
import Template from "./template/template";
import PopupChat from "./components/popup/popupChat";
import { DynamicIsInAChat, KnowMyChannel } from "./components/popup/chatManager";
import TokenPage from "./pages/authenticate";
import NotTwoFa from "./components/authenticate/AuthenticateComponentsNotTwoFa"
import TwoFa from "./components/authenticate/AuthenticateComponentsTwoFa"
import React, { ReactNode } from "react";
import Cookies from 'universal-cookie';

export const cookies = new Cookies();

export interface Props {
	openModal: (param: boolean) => void;
	setContent: (param: ReactNode) => void;
}

const AppInsideBrowser = ({ openModal, setContent }: Props) => {
	return (
		<>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/authenticate" Component={TokenPage} />
				<Route path="/authenticate/NotTwoFa" Component={NotTwoFa} />
				<Route path="/authenticate/TwoFa" Component={TwoFa} />
				<Route path="/Error" Component={TryToReconnect} />
				<Route element={<Template openModal={openModal} setContent={setContent}/>}>
					<Route path="/home/*" element={<Home></Home>} />
					<Route path="/game/*" element={<Game></Game>} />
					<Route path="/CreateTwoFa/*" element={<CreateTwoFaPage></CreateTwoFaPage>}/>
					<Route path="/history/*" element={<History></History>} />
				</Route>
			</Routes>
			
			{DynamicIsInAChat() && 
				<PopupChat path={KnowMyChannel()} openModal={openModal} setContent={setContent}/>
			}
		</>
	);
}




function App({ openModal, setContent }: Props) {
	return (
			<AppInsideBrowser openModal={openModal} setContent={setContent} />
	);

}

export default App;
