// src/views/FoodListView.tsx

import React, { useState, useEffect } from 'react';
import './FoodListView.css';

type GetFoodResponse = {
    foodId: number;
    name: string;
    description: string;
    image: string;
    dietaryRestrictions: string;
    price: string;
    pickupTime: string;
    productType: string;
    productProviderName: string;
};

const FoodListView: React.FC = () => {
    const [foods, setFoods] = useState<GetFoodResponse[]>([]);

    useEffect(() => {
        import('../resources/example-foods-response.json').then(data => {
            setFoods(data.expectedFoods);
        });
    }, []);

    return (
        <div>
            <h1>Foods List</h1>
            <div className="foods-container"> {/* Wrap foods in a container */}
                {foods.map(food => (
                    <div className="food-card" key={food.foodId}>
                        <img src={food.image} alt={food.name} />
                        <div className="food-info">
                            <h2>{food.name}</h2>
                            <p className="food-price">${parseFloat(food.price).toFixed(2)}</p>
                            <p>{food.description}</p>
                            <div className="food-details">
                                <p><span role="img" aria-label="dietary">🥗</span> {food.dietaryRestrictions}</p>
                                <p><span role="img" aria-label="clock">⏰</span> {food.pickupTime}</p>
                                <p><span role="img" aria-label="type">🍽️</span> {food.productType}</p>
                                <p><span role="img" aria-label="provider">🏢</span> {food.productProviderName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodListView;
