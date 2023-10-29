import React, {useState, useEffect} from 'react';
import './FoodListView.css';
import {
    DEFAULT_FILTER,
    fetchFoods,
    FoodCategory, getFoodCategories,
    GetFoodResponse,
    getProductProviders,
    ProductProvider
} from "../api/FoodApi";
import ErrorView from "./ErrorView";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {prettyTimeFormat} from "../utilities/Formatter";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ImageWithFallback from "../components/ImageWithFallback";

const FoodListView: React.FC = () => {
    const [foods, setFoods] = useState<GetFoodResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [productProviders, setProductProviders] = useState<ProductProvider[]>([]);
    const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([]);
    const [sortOrder, setSortOrder] = useState<string>(''); // You can define default value if needed

    useEffect(() => {
        const loadFoods = async () => {
            if (sortOrder === 'default' || sortOrder === '') {
                try {
                    const data = await fetchFoods(DEFAULT_FILTER);
                    // Simulate a slow network connection
                    setTimeout(() => setFoods(data), 400);
                } catch (e) {
                    if (e instanceof Error) {
                        setError(e.message);
                    }
                }
            }
        };
        const loadProductProviders = async () => {
            try {
                const data = await getProductProviders();
                setProductProviders(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        };
        const loadFoodCategories = async () => {
            try {
                const data = await getFoodCategories();
                setFoodCategories(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        };

        if (sortOrder === 'name') {
            setFoods((prevFoods) => [...prevFoods].sort((a, b) => a.name.localeCompare(b.name)));
        } else if (sortOrder === 'price_asc') {
            setFoods((prevFoods) => [...prevFoods].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
        } else if (sortOrder === 'price_desc') {
            setFoods((prevFoods) => [...prevFoods].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)));
        } else if (sortOrder === 'default') {
            setFoods([]);
            console.log(foods.length);
        }
        loadFoods();
        loadProductProviders();
        loadFoodCategories();
    }, [sortOrder]);


    if (error) {
        return <ErrorView message={error}/>;
    }

    return (
        <div className="platform-background-food-list">
            {
                foods.length === 0 && !error && (
                    <div className="circularProgress">
                        <CircularProgress/>
                    </div>
                )
            }
            <div className="product-list-container">
                <div className="filter-container">
                    <h3>Order by</h3>
                    <div className="sort-container">
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onError={(e) => console.log(e)}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="default">Default</option>
                            <option value="name">Name (A/Z)</option>
                            <option value="price_asc">Price (Low to High)</option>
                            <option value="price_desc">Price (High to Low)</option>
                            {/* Add other sort options as required */}
                        </select>
                    </div>
                    <h3>Filter by Categories</h3>
                    <ul>
                        {
                            foodCategories.map(category => (
                                <li key={category.id}>
                                    <input type="checkbox" id={category.name}/>
                                    <label htmlFor={category.name}>{category.name}</label>
                                </li>
                            ))
                        }
                        <li><input type="checkbox" id="vegan"/><label htmlFor="vegan">Vegan</label></li>
                    </ul>

                    <h3>Filter by Provider</h3>
                    <ul>
                        {
                            productProviders.map(provider => (
                                <li key={provider.id}>
                                    <input type="checkbox" id={provider.name}/>
                                    <label htmlFor={provider.name}>{provider.name}</label>
                                </li>
                            ))
                        }
                    </ul>

                    <h3>Filter by Pickup Time</h3>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker/>
                    </LocalizationProvider>
                </div>
                <div className="foods-container"> {/* Wrap foods in a container */}
                    {foods.map(food => (
                        <Link to={`/food/${food.foodId}`} key={food.foodId}>
                            <div className="food-card" key={food.foodId}>
                                <ImageWithFallback
                                    src={food.image}
                                    fallbackSrc="https://www.creativefabrica.com/wp-content/uploads/2021/08/12/Cartoon-fast-food-illustration-vector-Graphics-15801212-1-580x386.png"
                                    alt="Descriptive Alt Text"
                                />
                                <div className="food-info">
                                    <h2>{food.name}</h2>
                                    <p className="food-price">${parseFloat(food.price).toFixed(2)}</p>
                                    <div className="food-description">
                                        <p>{food.description.substring(0, 50)}...</p>
                                    </div>
                                    <div className="food-details">
                                        <p><span role="img">⏰</span> {prettyTimeFormat(food.pickupTime)}</p>
                                        <p><span role="img">🏢</span> {food.productProviderName}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodListView;
