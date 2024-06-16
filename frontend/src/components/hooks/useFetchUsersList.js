import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchListUsers = () => {
    const [listUsers, setListUsers] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchListUser = async () => {
            try {
                let response = await axios.get(`/users/listUser`);
                const filteredListUsers = response.data.listUser.filter(user => user.userid !== userId);
                setListUsers(filteredListUsers);  
            } catch (error) {
                console.error('Error fetching list user:', error); 
            }
        };
        fetchListUser(); 
    }, [userId]); 

    return listUsers;
}

export default useFetchListUsers;
