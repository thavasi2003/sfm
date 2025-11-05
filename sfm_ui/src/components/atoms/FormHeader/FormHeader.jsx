import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import './FormHeader.css';

const FormHeader = ({ title, onClose }) => {
  return (
    <div className='formheader-wrapper'>
      <div className='formheader-title'>
        <h2>{title}</h2>
        {onClose && (
          <CloseIcon className='formheader-close-icon' onClick={onClose} />
        )}
      </div>
    </div>
  );
};

export default FormHeader;
