import React from 'react';
import './ErrorView.css'; // You can create a separate CSS file for styling the error view.

interface ErrorViewProps {
    message: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ message }) => {
    return (
        <div className="error-container">
            <h2>Error</h2>
            <p>{message}</p>
        </div>
    );
};

export default ErrorView;