import React, { useState } from 'react';
import axios from 'axios';
import './AddFoodView.css';

const AddFoodView: React.FC = () => {
    const [formData, setFormData] = useState({
        product: {
            productType: 'FOOD',
            productProviderId: '1',
            name: '',
            description: '',
            image: '',
            price: '',
            pickupTime: ''
        },
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        nutFree: false,
        dairyFree: false,
        organic: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name in formData) {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                product: {
                    ...prevState.product,
                    [name]: value
                }
            }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/food/create-food', formData);
            console.log(response.data); // handle the response as you wish
        } catch (error) {
            console.error(error); // handle the error as you wish
        }
    };

    return (
        <div className="add-food-form-container">
            <form onSubmit={handleSubmit} className="add-food-form">
                <div>
                    <label htmlFor="productType">Product Type</label>
                    <select id="productType" name="productType" value={formData.product.productType} onChange={handleChange}>
                        <option value="FOOD">Food</option>
                        <option value="CLOTHES">Clothes</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.product.name} onChange={handleChange} />
                </div>


                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.product.description} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="image">Image URL</label>
                    <input type="text" id="image" name="image" value={formData.product.image} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="price">Price</label>
                    <input type="number" id="price" name="price" value={formData.product.price} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="pickupTime">Pickup Time</label>
                    <input type="datetime-local" id="pickupTime" name="pickupTime" value={formData.product.pickupTime} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="vegetarian">Vegetarian</label>
                    <input type="checkbox" id="vegetarian" name="vegetarian" checked={formData.vegetarian} onChange={handleCheckboxChange} />
                </div>

                <div>
                    <label htmlFor="vegan">Vegan</label>
                    <input type="checkbox" id="vegan" name="vegan" checked={formData.vegan} onChange={handleCheckboxChange} />
                </div>

                <div>
                    <label htmlFor="glutenFree">Gluten Free</label>
                    <input type="checkbox" id="glutenFree" name="glutenFree" checked={formData.glutenFree} onChange={handleCheckboxChange} />
                </div>

                <div>
                    <label htmlFor="nutFree">Nut Free</label>
                    <input type="checkbox" id="nutFree" name="nutFree" checked={formData.nutFree} onChange={handleCheckboxChange} />
                </div>

                <div>
                    <label htmlFor="dairyFree">Dairy Free</label>
                    <input type="checkbox" id="dairyFree" name="dairyFree" checked={formData.dairyFree} onChange={handleCheckboxChange} />
                </div>

                <div>
                    <label htmlFor="organic">Organic</label>
                    <input type="checkbox" id="organic" name="organic" checked={formData.organic} onChange={handleCheckboxChange} />
                </div>

                <div className="form-navigation">
                    <button type="submit" className="submit-btn">Add Food</button>
                </div>
            </form>
        </div>
    );
};

export default AddFoodView;
