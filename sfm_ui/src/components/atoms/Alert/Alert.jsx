import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ type, message, duration, icon }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!showAlert) {
    return null;
  }

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        <span className="alert-icon">{icon}</span>
        <p>{message}</p>
      </div>
      <div className="alert-loading" style={{ animationDuration: `${duration}ms` }}></div>
    </div>
  );
};

export default Alert;
