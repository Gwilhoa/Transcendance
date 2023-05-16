import {Route, Routes} from "react-router-dom";
import Auth from './pages/Auth';
// import AuthToken from './pages/AuthToken';
import NotFound from './pages/NotFound';
import CreateTwoFaPage from './pages/CreateTwoFa';
import Game from './pages/game';
import Accueil from './pages/accueil';
import PopupChat from "./popup/popupChat";
import { DynamicIsInAChat, KnowMyChannel } from "./popup/chatManager";
import TokenPage from "./pages/authenticate";
import Template from "./template/template";
import { ReactNode } from "react";

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
				<Route element={<Template openModal={openModal} setContent={setContent}/>}>
					<Route path="/accueil/*" element={<Accueil></Accueil>} />
					<Route path="/game/*" element={<Game></Game>} />
					<Route path="/CreateTwoFa/*" element={<CreateTwoFaPage></CreateTwoFaPage>}/>
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
