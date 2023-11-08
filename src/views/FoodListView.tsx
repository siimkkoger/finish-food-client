import React, {useState, useEffect, useRef, useReducer} from 'react';
import './FoodListView.css';
import {
    fetchFoods,
    FoodCategory, getFoodCategories,
    GetFoodResponse, GetFoodsFilter,
    getProductProviders, OrderBy,
    ProductProvider
} from "../api/FoodApi";
import ErrorView from "./ErrorView";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";
import {prettyTimeFormat} from "../utilities/Formatter";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import ImageWithFallback from "../components/ImageWithFallback";


const PAGE_SIZE = 15;

interface FoodListState {
    foods: GetFoodResponse[];
    foodIsToBeFetched: boolean;
    fetchingFood: boolean;
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

const READY_TO_FETCH = 'READY_TO_FETCH';
const FETCHING_FOODS = 'FETCHING_FOODS';
const FOODS_FETCHED = 'FOODS_FETCHED';
const RESET = 'RESET';

type Action =
    | {
    type: typeof FOODS_FETCHED;
    foods: GetFoodResponse[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
    | { type: typeof READY_TO_FETCH }
    | { type: typeof FETCHING_FOODS }
    | { type: typeof RESET };

const foodListStateReducer = (state: FoodListState, action: Action): FoodListState => {
    switch (action.type) {
        case READY_TO_FETCH:
            return {...state, foodIsToBeFetched: true};
        case FETCHING_FOODS:
            return {...state, foodIsToBeFetched: false, fetchingFood: true};
        case FOODS_FETCHED:
            return {
                ...state,
                foodIsToBeFetched: false,
                fetchingFood: false,
                foods: action.foods,
                currentPage: action.page,
                totalItems: action.totalItems,
                totalPages: action.totalPages,
            };
        case RESET:
            return {
                foods: [],
                foodIsToBeFetched: true,
                fetchingFood: false,
                currentPage: 0,
                totalItems: Number.MAX_SAFE_INTEGER,
                totalPages: Number.MAX_SAFE_INTEGER,
            };
        default:
            return state;
    }
};

const FoodListView: React.FC = () => {
    const navbarHeight = 105;
    const foodContainerRef = useRef<HTMLDivElement>(null);

    // Food states
    const [foodListState, dispatch] = useReducer(foodListStateReducer, {
        foods: [],
        foodIsToBeFetched: true,
        fetchingFood: false,
        currentPage: 0,
        totalItems: Number.MAX_SAFE_INTEGER,
        totalPages: Number.MAX_SAFE_INTEGER,
    });

    // Filter states
    const [sortOrderState, setSortOrderState] = useState<string>('');
    const [productProvidersState, setProductProvidersState] = useState<ProductProvider[]>([]);
    const [foodCategoriesState, setFoodCategoriesState] = useState<FoodCategory[]>([]);
    const [filterCategoryIdsState, setFilterCategoryIdsState] = useState<number[]>([]);
    const [filterProviderIdsState, setFilterProviderIdsState] = useState<number[]>([]);
    const [filterPickupTimeFromState, setFilterPickupTimeFromState] = useState<Date | null>(null);
    const [filterPickupTimeToState, setFilterPickupTimeToState] = useState<Date | null>(null);
    const [filterSectionIsStickyState, setFilterSectionIsStickyState] = useState(false);

    // Error state
    const [errorState, setErrorState] = useState<string | null>(null);


    useEffect(() => {
        (async () => {
            try {
                const [productProvidersData, foodCategoriesData] = await Promise.all([
                    getProductProviders(),
                    getFoodCategories(),
                ]);
                setProductProvidersState(productProvidersData);
                setFoodCategoriesState(foodCategoriesData);
            } catch (e) {
                if (e instanceof Error) {
                    setErrorState(e.message);
                }
            }
        })();
    }, []);

    useEffect(() => {
        const handleSidebarStickiness = () => {
            const navbarHeight = 60;
            setFilterSectionIsStickyState(window.scrollY > navbarHeight);
        };

        const handleInfiniteScrolling = () => {
            if (foodListState.fetchingFood) return;

            const scrolledDistanceFromTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            const totalScrolledHeight = scrolledDistanceFromTop + viewportHeight;
            const foodContainerHeight = foodContainerRef.current ? foodContainerRef.current.offsetHeight : 0;
            const threshold = 300;

            if (totalScrolledHeight >= foodContainerHeight - threshold) {
                dispatch({type: READY_TO_FETCH});
            }
        };

        const handleScroll = () => {
            handleSidebarStickiness();
            handleInfiniteScrolling();
        };

        // Add the event listener
        window.addEventListener('scroll', handleScroll);
        // Cleanup the event listener and mutation observer on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [foodListState.fetchingFood]);

    useEffect(() => {
        dispatch({type: RESET});
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [sortOrderState, filterCategoryIdsState, filterProviderIdsState, filterPickupTimeFromState, filterPickupTimeToState]);

    const moreFoodsAreAvailable = () => {
        return foodListState.totalPages > foodListState.currentPage;
    }

    useEffect(() => {
        if (!moreFoodsAreAvailable() || !foodListState.foodIsToBeFetched) return;

        let filter: GetFoodsFilter = {
            foodCategoryIds: [],
            foodCategoryIdsMatchAll: true,
            productProviderIds: [],
            pickupTimeFrom: undefined,
            pickupTimeTo: undefined,
            page: 1,
            pageSize: PAGE_SIZE,
            orderBy: 'CREATED_AT',
            direction: 'ASC',
        };

        const setupFilterBeforeFetchingFoods = () => {
            const orderConfig: { [key: string]: { orderBy: OrderBy, direction: string } } = {
                name: {orderBy: OrderBy.NAME, direction: 'ASC'},
                price_asc: {orderBy: OrderBy.PRICE, direction: 'ASC'},
                price_desc: {orderBy: OrderBy.PRICE, direction: 'DESC'},
                default: {orderBy: OrderBy.CREATED_AT, direction: 'ASC'},
            };

            const selectedOrderConfig = orderConfig[sortOrderState] || orderConfig['default'];
            filter.orderBy = selectedOrderConfig.orderBy;
            filter.direction = selectedOrderConfig.direction;

            // Setting up pickup times
            filter.pickupTimeFrom = filterPickupTimeFromState?.toISOString() || undefined;
            filter.pickupTimeTo = filterPickupTimeToState?.toISOString() || undefined;

            // Setting up category and provider IDs
            filter.foodCategoryIds = filterCategoryIdsState;
            filter.productProviderIds = filterProviderIdsState;

            // Setting up page number
            filter.page = foodListState.currentPage + 1;
        }

        const loadFoods = async () => {
            try {
                dispatch({type: FETCHING_FOODS});
                const data = await fetchFoods(filter);
                dispatch({
                    type: FOODS_FETCHED,
                    foods: [...foodListState.foods, ...data.foods],
                    page: data.page,
                    pageSize: data.pageSize,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages
                });
            } catch (e) {
                if (e instanceof Error) {
                    setErrorState(e.message);
                }
            }
        };

        setupFilterBeforeFetchingFoods();
        loadFoods();
    }, [
        foodListState.foodIsToBeFetched,
        sortOrderState,
        filterCategoryIdsState,
        filterProviderIdsState,
        filterPickupTimeFromState,
        filterPickupTimeToState
    ]);

    const handleCategoryFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, id} = event.target;
        setFilterCategoryIdsState(prevState => {
            if (checked) {
                return [...prevState, parseInt(id)];
            } else {
                return prevState.filter(categoryId => categoryId !== parseInt(id));
            }
        });
    };

    const handleProviderFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {checked, id} = event.target;
        setFilterProviderIdsState(prevState => {
            if (checked) {
                return [...prevState, parseInt(id)];
            } else {
                return prevState.filter(providerId => providerId !== parseInt(id));
            }
        });
    }

    const handlePickupTimeFromChange = (date: Date | null) => {
        setFilterPickupTimeFromState(date);
    }

    const handlePickupTimeToChange = (date: Date | null) => {
        setFilterPickupTimeToState(date);
    }

    if (errorState) {
        return <ErrorView message={errorState}/>;
    }

    return (
        <div className="platform-background-food-list">
            <div className="product-list-container">
                <div className="filter-container"
                     style={{
                         top: filterSectionIsStickyState ? '0px' : navbarHeight + 'px',
                         position: filterSectionIsStickyState ? 'fixed' : 'inherit',
                         marginTop: filterSectionIsStickyState ? '10px' : '0px'
                     }}>
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
                    <p>From</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker onAccept={handlePickupTimeFromChange}/>
                    </LocalizationProvider>
                    <p>To</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker onAccept={handlePickupTimeToChange}/>
                    </LocalizationProvider>
                    <button
                        className="clear-pickup-time-button"
                        onClick={() => {
                            setFilterPickupTimeFromState(null);
                            setFilterPickupTimeToState(null);
                        }}
                    >
                        Clear Pickup Time
                    </button>
                </div>

                <div className="foods-container" ref={foodContainerRef}
                     style={{marginLeft: filterSectionIsStickyState ? '330px' : '0px'}}>
                    {foodListState.foods.length > 0 && foodListState.foods.map(food => (
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
                    {
                        foodListState.fetchingFood && (
                            <div className="circularProgress">
                                <CircularProgress/>
                            </div>
                        )
                    }
                    {
                        !moreFoodsAreAvailable() && foodListState.foods.length !== 0 && (
                            <div className="no-more-foods">
                                <h1>No more foods available.</h1>
                            </div>
                        )
                    }
                    {foodListState.foods.length === 0 && !foodListState.fetchingFood && (
                        <div>
                            <h1>No foods found.</h1>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default FoodListView;
