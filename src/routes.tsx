import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import HomePage from './views/HomePage';
import ProductPage from './views/ProductPage';
import FoodListView from './views/FoodListView';
import CartPage from './views/CartPage';
import NotFoundPage from './views/NotFoundPage';
import NavBar from "./components/NavBar";
import FoodDetailView from "./views/FoodDetailView";
import FoodsManageView from "./manage-foods/FoodsManageView";
import AddFoodView from "./manage-foods/AddFoodView";

const RoutesComponent: React.FC = () => {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/product/:productId" element={<ProductPage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/food" element={<FoodListView/>}/>
                <Route path="/food/:id" element={<FoodDetailView/>} />
                <Route path="/food/manage" element={<FoodsManageView/>}/>
                <Route path="/food/add" element={<AddFoodView/>}/>

                {/* 404 - Not Found route */}
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    );
};

export default RoutesComponent;

