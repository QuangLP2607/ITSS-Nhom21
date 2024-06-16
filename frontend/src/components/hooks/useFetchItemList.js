import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchListItems = () => {
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const fetchListItems = async () => {
      try {
        const response = await axios.get('/users/itemslist');
        setListItems(response.data.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchListItems();
  }, []);

  return listItems;
};

export default useFetchListItems;
