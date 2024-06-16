import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchListRecipes = () => {
    const [listRecipes, setListRecipes] = useState([]);

    useEffect(() => {
        const fetchListRecipes = async () => {
            try {
                const response = await axios.get('/users/recipes');
                setListRecipes(response.data.recipes);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchListRecipes();
    }, []);

    return listRecipes;
};

export default useFetchListRecipes;
