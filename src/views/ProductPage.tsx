// src/views/ProductPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();

    return (
        <div>
            <h1>Product Details</h1>
            <p>Viewing details for product ID: {productId}</p>
        </div>
    );
};

export default ProductPage;
