import { BrowserRouter, Route, Routes} from "react-router-dom";
import Auth from './pages/Auth';
import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import Game from './pages/game';
import Accueil from './pages/accueil';
import PopupChat from "./popup/popupChat";
import { DynamicIsInAChat, KnowMyChannel } from "./popup/chatManager";
import TokenPage from "./pages/authenticate";
import Template from "./template/template";
import { ReactNode } from "react";

export interface MyComponentProps {
	openModal: (param: boolean) => void;
	setContent: (param: ReactNode) => void;
}

const AppInsideBrowser = ({ openModal, setContent }: MyComponentProps) => {
	return (
			<>
			<Routes>
				<Route path="/" Component={Auth}/>
				<Route path="/auth" Component={AuthToken}/>
				<Route path="*" Component={NotFound}/>
				<Route path="/authenticate" Component={TokenPage} />
				<Route path="/accueil/*" element={<Template openModal={openModal} setContent={setContent} child={Accueil}/>} />
				<Route path="/game/*" element={<Template openModal={openModal} setContent={setContent} child={Game}/>} />
			</Routes>
			
				{DynamicIsInAChat() && 
					<PopupChat path={KnowMyChannel()} openModal={openModal} setContent={setContent}/>
				}
			</>

	);
}




function App({ openModal, setContent }: MyComponentProps) {
	return (
		<BrowserRouter>
		<AppInsideBrowser openModal={openModal} setContent={setContent} />
		</BrowserRouter>
	);

}

export default App;
