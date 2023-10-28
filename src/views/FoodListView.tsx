import React, {useState, useEffect} from 'react';
import './FoodListView.css';
import {DEFAULT_FILTER, fetchFoods, GetFoodResponse} from "../api/FoodApi";
import ErrorView from "./ErrorView";
import {Link} from "react-router-dom";

const FoodListView: React.FC = () => {
    const [foods, setFoods] = useState<GetFoodResponse[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getFoods = async () => {
            try {
                const data = await fetchFoods(DEFAULT_FILTER);
                setFoods(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        };
        getFoods();
    }, []);

    if (error) {
        return <ErrorView message={error}/>;
    }

    return (
        <div className="foods-container"> {/* Wrap foods in a container */}
            {foods.map(food => (
                <Link to={`/food/${food.foodId}`} key={food.foodId}>
                    <div className="food-card" key={food.foodId}>
                        <img src={food.image} alt={food.name}/>
                        <div className="food-info">
                            <h2>{food.name}</h2>
                            <p className="food-price">${parseFloat(food.price).toFixed(2)}</p>
                            <div className="food-description">
                                <p>{food.description.substring(0, 50)}...</p>
                            </div>
                            <div className="food-details">
                                <p><span role="img">⏰</span> {food.pickupTime}</p>
                                <p><span role="img">🏢</span> {food.productProviderName}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default FoodListView;
