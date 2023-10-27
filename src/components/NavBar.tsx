import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Import the CSS file
import { useState } from 'react';

const NavBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // You can add logic here to handle the search term.
        // For instance, redirecting to a search page or filtering a list.
        console.log(`Searching for: ${searchTerm}`);
    };

    return (
        <div className="NavBar">
            <header className="NavBar-header">
                <div className="NavBar-logo">Your Logo</div>
                <Link to="/" className="NavBar-link">Home</Link>
                <Link to="/foods" className="NavBar-link">Foods</Link>
                <Link to="/product/:productId" className="NavBar-link">Product</Link>
                <Link to="/cart" className="NavBar-link">Cart</Link>

                {/* Search bar */}
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                    />
                    <button type="submit">
                        <span role="img" aria-label="search-icon">🔍</span>
                    </button>
                </form>
            </header>
        </div>
    );
};

export default NavBar;
