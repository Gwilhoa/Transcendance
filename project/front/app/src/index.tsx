import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import Modal from './components/profil/modal';
import React, { ReactNode, useState } from 'react';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter as Router } from 'react-router-dom'


function MainComponent() {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState<ReactNode>();

  return (
    <CookiesProvider>
		<Router>
			<App openModal={setShow} setContent={setContent} />
			<Modal boolModal={show} openModal={setShow} content={content}/> 
		</Router>
    </CookiesProvider>
  
  );
}

reportWebVitals();
const root = document.getElementById('root');
if (root) {
  const mainRoot = createRoot(root);
  mainRoot.render(<MainComponent/>);
}
