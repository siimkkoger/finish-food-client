// src/views/NotFoundPage.tsx

import React from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
    return (
        <div className="notfound-page">
            <h1 className="error-number">404</h1>
            <p className="error-description">Sorry, the page you're looking for does not exist.</p>
        </div>
    );
};

export default NotFoundPage;
