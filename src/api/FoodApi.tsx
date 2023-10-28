import axios from 'axios';

const BASE_URL_FOOD = 'http://localhost:8080/api/food';
const BASE_URL_PRODUCT = 'http://localhost:8080/api/product';

export const fetchFoods = async (filter: GetFoodsFilter): Promise<GetFoodResponse[]> => {
    try {
        const response = await axios.post(`${BASE_URL_FOOD}/get-foods`, filter);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFoodById = async (id: string): Promise<GetFoodResponse> => {
    try {
        const response = await axios.get(`${BASE_URL_FOOD}/get-food/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const addFoodToCart = async (foodId: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${BASE_URL_FOOD}/add-food-to-cart/${foodId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export type ProductProvider = {
    id: number;
    name: string;
}

export const getProductProviders = async (): Promise<ProductProvider[]> => {
    try {
        const response = await axios.get(`${BASE_URL_PRODUCT}/get-providers`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export type FoodCategory = {
    id: number;
    name: string;
}

export const getFoodCategories = async (): Promise<FoodCategory[]> => {
    try {
        const response = await axios.get(`${BASE_URL_FOOD}/get-food-categories`);
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