import React from 'react';
import { useState, useEffect } from 'react';


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


function Auth() {
  //state

  //comportement

  //render	
  return (
	<div className="Authentificate">
		<h1>Transcendence</h1>
		<a
		className="api42-link"
		href="http://localhost:6200/auth/login"
		target="_blank"
		rel="noopener noreferrer"
		>
			Authentification
		</a>
    </div>
  );
}
export default Auth;
