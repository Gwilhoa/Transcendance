import React, { useState } from 'react';
import './profil.css';

function CloseAll() {
  const [showSquare, setShowSquare] = useState(false);

  const handleClick = () => {
    setShowSquare(!showSquare);
  }

  return (
      <div className="overlay" onClick={handleClick}>
        {showSquare && <div className="square"></div>}
      </div>
  );
}

export default CloseAll;