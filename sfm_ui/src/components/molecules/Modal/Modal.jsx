import React from 'react';
import './Modal.css';

const Modal = ({ open, title, children, buttons=[] }) => {
  return (
    <div className={`modal ${open ? 'show' : ''}`}>
      <div className='modal-wrapper'>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          
        </div>
        <div className="modal-body">
          {children}
        </div>
        {buttons.length > 0 && (
          <div className="modal-footer">
            {buttons.map((button, index) => (
              <button 
                key={index} 
                className={`modal-button ${button.className}`} 
                onClick={button.onClick}
              >
              {button.label}
            </button>
          ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Modal;
