import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import './FoodDetailView.css';
import {addFoodToCart, fetchFoodById, GetFoodResponse} from "../api/FoodApi";
import ErrorView from "./ErrorView";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {Alert, CircularProgress} from "@mui/material";
import ImageWithFallback from "../components/ImageWithFallback";


const FoodDetailView: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [snackBarIsVisible, setSnackBarIsVisible] = React.useState(false);

    const [getFoodResponse, setGetFoodResponse] = useState<GetFoodResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackBarIsVisible(false);
    };

    useEffect(() => {
        const fetchFood = async () => {
            try {
                if (id === undefined) throw new Error("No food id provided");
                const data = await fetchFoodById(id);
                setTimeout(() => setGetFoodResponse(data), 300);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        };
        fetchFood();
    }, [id]);

    if (error) {
        return <ErrorView message={error}/>
    }

    const handleAddToCart = () => {
        const addToCart = async () => {
            try {
                if (id === undefined) throw new Error("No food id provided");
                const added = await addFoodToCart(id);
                setSnackBarIsVisible(added);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                }
            }
        };
        addToCart();
    }

    return (
        <div className="platform-background-food-item">
            {
                !getFoodResponse && !error && (
                    <div className="circularProgress">
                        <CircularProgress/>
                    </div>
                )
            }
            {
                getFoodResponse != null && (
                    <div className="food-details-card">
                        <div className="large-price-overflow-container">
                            <ImageWithFallback
                                src={getFoodResponse.image}
                                fallbackSrc="https://www.creativefabrica.com/wp-content/uploads/2021/08/12/Cartoon-fast-food-illustration-vector-Graphics-15801212-1-580x386.png"
                                alt="Descriptive Alt Text"
                                className="large-image"
                            />
                        </div>
                        <div className="food-detail-view">
                            <h1>{getFoodResponse.name}</h1>
                            <p className="large-price">${parseFloat(getFoodResponse.price).toFixed(2)}</p>

                            <div className="food-info-section">
                                <div>
                                    <h2>Detailed food information</h2>
                                    <p>{getFoodResponse.description}</p>
                                </div>
                                <div className="food-info-true">
                                    <h3>Yes:</h3>
                                    {getFoodResponse.vegetarian && <p>Vegetarian</p>}
                                    {getFoodResponse.vegan && <p>Vegan</p>}
                                    {getFoodResponse.glutenFree && <p>Gluten Free</p>}
                                    {getFoodResponse.nutFree && <p>Nut Free</p>}
                                    {getFoodResponse.dairyFree && <p>Dairy Free</p>}
                                    {getFoodResponse.organic && <p>Organic</p>}
                                </div>
                                <div className="food-info-false">
                                    <h3>No:</h3>
                                    {!getFoodResponse.vegetarian && <p>Vegetarian</p>}
                                    {!getFoodResponse.vegan && <p>Vegan</p>}
                                    {!getFoodResponse.glutenFree && <p>Gluten Free</p>}
                                    {!getFoodResponse.nutFree && <p>Nut Free</p>}
                                    {!getFoodResponse.dairyFree && <p>Dairy Free</p>}
                                    {!getFoodResponse.organic && <p>Organic</p>}
                                </div>
                            </div>
                            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>

                            <Snackbar
                                open={snackBarIsVisible}
                                autoHideDuration={3000}
                                onClose={handleCloseSnackBar}
                                message="Custom message"
                            >
                                <Alert onClose={handleCloseSnackBar} severity="success" sx={{width: '100%'}}>
                                    Added to cart
                                </Alert>
                            </Snackbar>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default FoodDetailView;