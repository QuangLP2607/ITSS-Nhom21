import React, { useState, useEffect, useContext } from 'react'; 
import { Container, Table, Modal, Button } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import {Header} from '../../components/Layouts/Header/Header';
import globalstyles from '../../CSSglobal.module.css';
import { GroupIdContext } from '../../components/context/UserIdAndGroupIdContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export const FoodStorage = () => {
    const [foodStorage, setFoodStorage] = useState([]);
    const { groupId } = useContext(GroupIdContext);

    useEffect(() => {
        fetchFoodStorage();
    }, []);

    const fetchFoodStorage = async () => {
        try {
            let response = await axios.get(`/users/foodStorage?groupid=${ groupId }`);
            setFoodStorage(response.data.FoodStorage);
        } catch (error) {
            console.error('Error fetching food storage:', error); 
        }
    };

    //-----------------------------------------
    //------------Delete-----------------------
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    const handleDelete = (food) => {
        setRecipeToDelete(food);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = async (food) => {
        try {
            await axios.delete(`/users/foodStorage?fridgeitemid=${food.fridgeitemid}&itemid=${food.itemid}`);
            setFoodStorage(prevFoods => prevFoods.filter(item => item.fridgeitemid !== food.fridgeitemid));
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting food:', error);
        }
    };
    
    //-----------------------------------------
    //------------Update-----------------------
    const [editingFood, setEditingFood] = useState({
        fridgeitemid: '',
        quantity: '',
        expirydate: ''
    });

    const handleUpdateClick = (food) => {
        setEditingFood(prevEditingFood => ({
            ...prevEditingFood,
            fridgeitemid: food.fridgeitemid,
            quantity: food.quantity,
            expirydate: food.expirydate
        }));
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\D/g, ''); 
        setEditingFood(prevItem => ({ ...prevItem, quantity: filteredValue }));
    };

    const handleDateChange = (newDate) => {
        setEditingFood({
            ...editingFood,
            expirydate: new Date(newDate).toISOString()
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.patch(`/users/foodStorage?fridgeitemid=${editingFood.fridgeitemid}`, {
                quantity: editingFood.quantity,
                expirydate: editingFood.expirydate
            });            
            setFoodStorage(prev => prev.map(food =>
                food.fridgeitemid === editingFood.fridgeitemid ? { ...food, ...editingFood } : food
            ));            
            setEditingFood({ fridgeitemid: '', quantity: '', expirydate: '' });
        } catch (error) {
            console.error('Error updating foodStorage:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingFood({
            fridgeitemid: '',
            quantity: '',
            expirydate: ''
        });
    };
    
    return (
        <div>
            <Header/>
            <Sidebar/>
            <Container fluid className={globalstyles['main-background']}>
                <div className={globalstyles['left-title']}>Tủ lạnh</div>
                <Table className={globalstyles['table-1000']}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <th>STT</th>
                            <th>Tên thực phẩm</th>
                            <th>Số lượng</th>
                            <th>Hạn sử dụng</th>
                            <th style={{ minWidth: '115px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodStorage.map((food, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td>{food.itemname}</td>
                                <td style={{ textAlign: 'center'}}>
                                    {editingFood.fridgeitemid === food.fridgeitemid ? (
                                            <input
                                                type="text"
                                                value={editingFood.quantity}
                                                onChange={handleQuantityChange}
                                                style={{ textAlign: 'center', border: 'none', maxWidth: '70px'}}
                                            />
                                        ) : (
                                            food.quantity
                                        )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {editingFood.fridgeitemid === food.fridgeitemid ? (
                                        <input 
                                            type="date" 
                                            value={new Date(editingFood.expirydate).toISOString().slice(0, 10)}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                        />
                                    ) : (
                                        new Date(food.expirydate).toLocaleDateString()
                                    )}
                                </td>
                                <td style={{ textAlign: 'center', width: 'auto', height: '100%' }}>
                                    {editingFood.fridgeitemid === food.fridgeitemid ? (
                                        <React.Fragment>
                                            <div className={globalstyles['icon-container']} style={{backgroundColor: 'rgb(255, 255, 255)'}} onClick={handleUpdate}>
                                                <FontAwesomeIcon icon={faCheck} color="green" size="xl" />
                                            </div>
                                            <div className={globalstyles['icon-container']} style={{backgroundColor: 'rgb(255, 255, 255)'}} onClick={handleCancelEdit}>
                                                <FontAwesomeIcon color="red" icon={faTimes} size="xl"/>
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <div className={globalstyles['icon-container']} onClick={() => handleUpdateClick(food)}>
                                                <FontAwesomeIcon color="white" icon={faEdit} />
                                            </div>
                                            <div className={globalstyles['icon-container']} onClick={() => handleDelete(food)}>
                                                <FontAwesomeIcon color="white" icon={faTrash} />
                                            </div>
                                        </React.Fragment>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            {/* Modal xóa thực phẩm */}
            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa mục này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowDeleteConfirmation(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteConfirmed(recipeToDelete)}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
