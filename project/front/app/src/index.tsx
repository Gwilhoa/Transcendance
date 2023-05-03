import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';

const root = createRoot(document.getElementById('root')!);

root.render(
	<CookiesProvider>
      <App />
    </CookiesProvider>
);

reportWebVitals();
