import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/food';

export const fetchFoods = async (filter: GetFoodsFilter): Promise<GetFoodResponse[]> => {
    try {
        const response = await axios.post(`${BASE_URL}/get-foods`, filter);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFoodById = async (id: string): Promise<GetFoodResponse> => {
    try {
        const response = await axios.get(`${BASE_URL}/get-food/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addFoodToCart = async (foodId: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${BASE_URL}/add-food-to-cart/${foodId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

type GetFoodsFilter = {
    foodCategoryIds?: Set<number>;
    productProviderName?: string;
    pickupTimeFrom?: string; // Convert this to string in YYYY-MM-DDTHH:MM:SS format when using
    pickupTimeTo?: string;  // Convert this to string in YYYY-MM-DDTHH:MM:SS format when using
    page?: number;
    pageSize?: number;
    orderBy?: string;
    direction?: string;
}

// Default values for GetFoodsFilter
export const DEFAULT_FILTER: GetFoodsFilter = {
    page: 1,
    pageSize: 100,
    orderBy: 'CREATED_AT',
    direction: 'ASC'
};

export type GetFoodResponse = {
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