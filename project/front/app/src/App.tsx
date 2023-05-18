import {Route, Routes} from "react-router-dom";
import Auth from './pages/Auth';
// import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import CreateTwoFaPage from './pages/CreateTwoFa';
import Game from './pages/game';
import Accueil from './pages/accueil';
import History from './pages/history';
import PopupChat from "./components/popup/popupChat";
import { DynamicIsInAChat, KnowMyChannel } from "./components/popup/chatManager";
import TokenPage from "./pages/authenticate";
import Template from "./template/template";
import React, { ReactNode } from "react";

export interface MyComponentProps {
	openModal: (param: boolean) => void;
	setContent: (param: ReactNode) => void;
}

const AppInsideBrowser = ({ openModal, setContent }: MyComponentProps) => {
	return (
		<>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/authenticate" Component={TokenPage} />
				<Route path="/accueil/*" element={<Template openModal={openModal} setContent={setContent} child={Accueil}/>} />
				<Route path="/game/*" element={<Template openModal={openModal} setContent={setContent} child={Game}/>} />
				<Route path="/CreateTwoFa/*" element={<Template openModal={openModal} setContent={setContent} child={CreateTwoFaPage}/>} />
				<Route path="/history" element={<Template openModal={openModal} setContent={setContent} child={History}/>} />
			</Routes>
			
				{DynamicIsInAChat() && 
					<PopupChat path={KnowMyChannel()} openModal={openModal} setContent={setContent}/>
				}
		</>
	);
}




function App({ openModal, setContent }: MyComponentProps) {
	return (
			<AppInsideBrowser openModal={openModal} setContent={setContent} />
	);

}

export default App;
