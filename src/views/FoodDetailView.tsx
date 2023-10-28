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

enum SnackBarType {
    success = "success",
    error = "error"
}

enum SnackBarVisibility {
    visible = "visible",
    hidden = "hidden"
}



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
                setGetFoodResponse(data);
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

    if (!getFoodResponse) {
        return <CircularProgress/>
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
        <div className="food-detail-view">
            <img src={getFoodResponse.image} alt={getFoodResponse.name} className="large-image"/>
            <h1>{getFoodResponse.name}</h1>
            <p className="large-price">${parseFloat(getFoodResponse.price).toFixed(2)}</p>
            <p>{getFoodResponse.description}</p>
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
    );
};

export default FoodDetailView;