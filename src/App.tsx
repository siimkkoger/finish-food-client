import React from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                {/* Navigation Buttons */}
                <Link to="/">Home</Link>
                <Link to="/food">Foods</Link>
                <Link to="/product/:productId">Product</Link>
                <Link to="/cart">Cart</Link>
            </header>
            {/* ... rest of your app content */}
        </div>
    );
};

export default App;