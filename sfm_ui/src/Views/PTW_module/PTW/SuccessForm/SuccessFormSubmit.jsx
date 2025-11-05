import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessFormSubmit.css';
import Button from '../../../../components/atoms/Button/Button.jsx';


const SuccessFormSubmit = ({ message='You have Completed the Checklist', redirectPath='/', buttonText='Return to Home'}) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(redirectPath, { replace: true }); // Use replace to prevent going back to this page
    };

    return (
        <div className="success-page-container">
            <div className="success-page-content">
                <div className="success-icon">&#10004;</div>
                <h1 className="success-message">{message}</h1>
                <div className="success-button">
                <Button 
                label={buttonText}
                size='large'
                variant='success'
                onClick={handleRedirect}
                />
                </div>
            </div>
        </div>
    );
};

export default SuccessFormSubmit;
