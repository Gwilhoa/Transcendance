import React, { useEffect, useState } from 'react';
import './App.css';

function GetTokenUser(props: { url: string }) {
  const [body, setBody] = useState<string | null>(null);

  useEffect(() => {
    fetch(props.url)
      .then((response) => response.text())
      .then((text) => setBody(text));
  }, []);

  if (!body) {
    return <div>Loading...</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: body }} />;
}

function App() {
  return (
	<div className="App">
		<h1>Transcendence</h1>
		<a
		className="api42-link"
		href="http://localhost:3000/auth/login"
		target="_blank"
		rel="noopener noreferrer"
		>
			Authentification
		</a>
			<GetTokenUser url="http://localhost:3000/auth/login"/>
    </div>
  );
}

export default App;
