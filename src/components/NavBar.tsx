import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import './NavBar.css'; // Import the CSS file
import {useState} from 'react';
import {DEFAULT_FILTER, fetchFoods, GetFoodResponse} from "../api/FoodApi";

const NavBar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foods, setFoods] = useState<GetFoodResponse[]>([]);
    const [showFoodList, setShowFoodList] = useState(false);

    useEffect(() => {
        const getFoods = async () => {
            try {
                const data = await fetchFoods(DEFAULT_FILTER);
                setFoods(data);
            } catch (error) {
                console.error("Error fetching foods:", error);
            }
        };
        getFoods();
    }, []);

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
                <Link to="/food" className="NavBar-link">Foods</Link>
                <Link to="/product/:productId" className="NavBar-link">Product</Link>
                <Link to="/cart" className="NavBar-link">Cart</Link>

                {/* Search bar and dropdown container */}
                <div className="search-container">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowFoodList(true)}
                            onBlur={() => setTimeout(() => setShowFoodList(false), 200)}
                            placeholder="Search..."
                        />
                        <button type="submit">
                            <span role="img" aria-label="search-icon">🔍</span>
                        </button>
                    </form>

                    {/* Food list */}
                    {showFoodList && (
                        <div className="search-food-list">
                            {foods.map(food => (
                                <div className="food-item" key={food.foodId}>
                                    <img src={food.image} alt={food.name} className="food-item-image"/>
                                    <div className="food-name-provider">
                                        <span className="food-name">{food.name}</span>
                                        <br/>
                                        <span className="food-provider">{food.productProviderName}</span>
                                    </div>
                                    <div className="food-price">
                                        ${parseFloat(food.price).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>
        </div>
    );
};

export default NavBar;
