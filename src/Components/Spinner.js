import React from 'react';
import spinnerImage from '../Assets/Images/remesalogo.png';

function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <div className="spinner-image-container">
        <img src={spinnerImage} width={130} alt="Spinner" className="spinner-image" />
      </div>
    </div>
  );
}

export { Spinner }
