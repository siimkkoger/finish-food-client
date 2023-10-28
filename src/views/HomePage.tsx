// src/views/HomePage.tsx

import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="landing-page">
            <h1 className="landing-title">Welcome to the Home Page</h1>
            <p className="mission-statement">Our mission is to provide the best products for our customers.</p>
        </div>
    );
};

export default HomePage;
