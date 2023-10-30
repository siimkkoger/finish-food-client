import React, {useState, useEffect} from 'react';
import './FoodListView.css';
import {
    DEFAULT_FILTER,
    fetchFoods,
    FoodCategory, getFoodCategories,
    GetFoodResponse, GetFoodsFilter,
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

let filter: GetFoodsFilter = {
    foodCategoryIds: [],
    foodCategoryIdsMatchAll: true,
    productProviderIds: [],
    pickupTimeFrom: undefined,
    pickupTimeTo: undefined,
    page: 1,
    pageSize: 100,
    orderBy: 'CREATED_AT',
    direction: 'ASC',
};

const FoodListView: React.FC = () => {
    const [foodsState, setFoodsState] = useState<GetFoodResponse[]>([]);
    const [errorState, setErrorState] = useState<string | null>(null);
    const [productProvidersState, setProductProvidersState] = useState<ProductProvider[]>([]);
    const [foodCategoriesState, setFoodCategoriesState] = useState<FoodCategory[]>([]);
    const [sortOrderState, setSortOrderState] = useState<string>(''); // You can define default value if needed
    let [filterCategoryIdsState, setFilterCategoryIdsState] = useState<number[]>([]);
    let [filterProviderIdsState, setFilterProviderIdsState] = useState<number[]>([]);

    filter.foodCategoryIds = [...filterCategoryIdsState];
    filter.productProviderIds = [...filterProviderIdsState];

    useEffect(() => {
        const loadProductProviders = async () => {
            try {
                const data = await getProductProviders();
                setProductProvidersState(data);
            } catch (e) {
                if (e instanceof Error) {
                    setErrorState(e.message);
                }
            }
        };
        loadProductProviders();
    }, []);

    useEffect(() => {
        const loadFoodCategories = async () => {
            try {
                const data = await getFoodCategories();
                setFoodCategoriesState(data);
            } catch (e) {
                if (e instanceof Error) {
                    setErrorState(e.message);
                }
            }
        };
        loadFoodCategories();
    }, []);

    useEffect(() => {
        const loadFoods = async () => {
            try {
                const data = await fetchFoods(filter);
                // Simulate a slow network connection
                // setTimeout(() => setFoodsState(data), 300);
                setFoodsState(data);

                if (sortOrderState === 'name') {
                    setFoodsState((prevFoods) => [...prevFoods].sort((a, b) => a.name.localeCompare(b.name)));
                } else if (sortOrderState === 'price_asc') {
                    setFoodsState((prevFoods) => [...prevFoods].sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
                } else if (sortOrderState === 'price_desc') {
                    setFoodsState((prevFoods) => [...prevFoods].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)));
                } else if (sortOrderState === 'default') {
                    setFoodsState([]);
                }

            } catch (e) {
                if (e instanceof Error) {
                    setErrorState(e.message);
                }
            }
        };

        loadFoods();
    }, [sortOrderState, filterCategoryIdsState, filterProviderIdsState]);

    const handleCategoryFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, id} = event.target;
        setFilterCategoryIdsState(prevState => {
            if (checked) {
                return [...prevState, parseInt(id)]; // Adding id
            } else {
                return prevState.filter(categoryId => categoryId !== parseInt(id)); // Removing id
            }
        });
    };

    const handleProviderFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, id} = event.target;
        setFilterProviderIdsState(prevState => {
            if (checked) {
                return [...prevState, parseInt(id)]; // Adding id
            } else {
                return prevState.filter(providerId => providerId !== parseInt(id)); // Removing id
            }
        });
    }


    if (errorState) {
        return <ErrorView message={errorState}/>;
    }

    return (
        <div className="platform-background-food-list">
            {
                foodsState.length === 0 && !errorState && (
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
                            value={sortOrderState}
                            onError={(e) => console.log(e)}
                            onChange={(e) => setSortOrderState(e.target.value)}
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
                            foodCategoriesState.map(category => (
                                <li key={category.id}>
                                    <input type="checkbox" id={category.id.toString()}
                                           onChange={handleCategoryFilterChange}/>
                                    <label htmlFor={category.name}>{category.name}</label>
                                </li>
                            ))
                        }
                    </ul>

                    <h3>Filter by Provider</h3>
                    <ul>
                        {
                            productProvidersState.map(provider => (
                                <li key={provider.id}>
                                    <input type="checkbox" id={provider.id.toString()}
                                           onChange={handleProviderFilterChange}/>
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
                    {foodsState.map(food => (
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
