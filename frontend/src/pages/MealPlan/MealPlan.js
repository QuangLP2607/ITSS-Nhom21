import React, { useState, useEffect, useContext } from 'react'; 
import { Container, Row, Form, Button, Table, Modal, Dropdown } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import {Header} from '../../components/Layouts/Header/Header';
import globalstyles from '../../CSSglobal.module.css';
import styles from './MealPlan.module.css';
import Arrow from '../../../assets/img/Arrow.png';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import useFetchListRecipes from '../../components/hooks/useFetchRecipesList';
import { GroupIdContext } from '../../components/context/UserIdAndGroupIdContext';

export const MealPlan = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [meal, setMeal] = useState('Sáng');
    const [recipes, setRecipes] = useState([]);
    const listRecipes = useFetchListRecipes();
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { groupId } = useContext(GroupIdContext);

    //-------------------Xử lý chọn ngày-------------------
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        setSelectedDate(formattedDate);
    }, []); 


    const handleDateChange = async (event) => {
        const newDate = event.target.value;  
        setSelectedDate(newDate);
    };
    
    const handlePreviousDay = async () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        setSelectedDate(currentDate.toISOString().slice(0, 10));
    };
    
    const handleNextDay = async () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        setSelectedDate(currentDate.toISOString().slice(0, 10));
    };

    const handleMealSelection = (eventKey) => {
        let mealText;
        switch (eventKey) {
            case 'breakfast':   mealText = 'Sáng';  break;
            case 'lunch':       mealText = 'Trưa';  break;
            case 'dinner':      mealText = 'Tối';   break;
        }
        setMeal(mealText);
    };
    //-------------------------------------------------------
    //-------------------Thêm món ăn-------------------------
    const [newRecipe, setNewRecipe] = useState({
        recipeid: '',
        recipename: ''
    });

    const handleRecipeNameChange = (e) => {
        const value = e.target.value.toLowerCase(); 
        const filteredResults = listRecipes.filter(recipe => {
            const searchString = recipe.recipename.toLowerCase(); 
            return searchString.includes(value);
        }).slice(0, 15);
        setSearchResults(filteredResults);
        setNewRecipe({ ...newRecipe, recipename: value });
    };

    const handleSelectRecipeName = (selectedRecipeId, selectedRecipeName) => {
        setNewRecipe({ ...newRecipe, recipeid: selectedRecipeId, recipename: selectedRecipeName });
        setSearchResults([]);
    };

    const handleAddButtonClick = () => {
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
    };

    const handleAddModalConfirm = async () => {
        try {
            await axios.post('/users/mealplan', {
                date: selectedDate,
                mealtype: meal,
                groupid: groupId,
                recipeid: newRecipe.recipeid
            });
            setShowAddModal(false);
            fetchRecipes();
        } catch (error) {
            console.error('Error adding meal plan:', error);
        }
    };
    //-------------------------------------------------------
    //--------Lấy danh sách các món ăn trong bữa-------------
    useEffect(() => {
        fetchRecipes();
    }, [listRecipes, selectedDate, meal]);
    
    const fetchRecipes = async () => {
        try {
            let response = await axios.get(`/users/mealplan?dateadded=${selectedDate}&mealtype=${meal}&groupid=${groupId}`);
            const RecipeData = response.data;
            const mealPlan = RecipeData.recipes;

            const combinedRecipes = mealPlan.map(mealPlan => {
                const correspondingMealPlan = listRecipes.find(recipe => recipe.recipeid === mealPlan.recipeid);
                return {
                    ...mealPlan,
                    ...correspondingMealPlan
                };
            });
            setRecipes(combinedRecipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };
    
    //-------------------------------------------------------
    //-------------------Delete recipe-----------------------
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);

    const handleDelete = (recipe) => {
        setRecipeToDelete(recipe);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = async (recipe) => {
        try {
            await axios.delete(`/users/mealplan?cookingplanid=${recipe.cookingplanid}&recipeid=${recipe.recipeid}`);
            setShowDeleteConfirmation(false);
            const updatedRecipes = recipes.filter(item => item !== recipe);
            setRecipes(updatedRecipes);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    
    
    //-------------------------------------------------------
    //-------------------View recipe-------------------------
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState({});

    const handleView = (recipe) => {
        setSelectedRecipe(recipe);
        setShowViewModal(true);
    };

    const handleViewModalClose = () => {
        setShowViewModal(false);
    };
    //-------------------------------------------------------
    //-------------------Update status-----------------------
    const handleStatusChange = (recipe, value) => {
        const updatedRecipe = { ...recipe, status: value === 'true' };
        const updatedRecipes = recipes.map(item => {
            if (item === recipe) return updatedRecipe;
            return item;
        });
        setRecipes(updatedRecipes);
        axios.patch(`/users/mealplan?cookingplanid=${updatedRecipe.cookingplanid}&recipeid=${updatedRecipe.recipeid}`, { status: updatedRecipe.status })
        .catch(error => {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        });
    
    };
    
    return (
        <div>
            <Header/>
            <Sidebar/>
            <Container fluid className={globalstyles['main-background']}>
                <div className={globalstyles['left-title']}>Kế hoạch nấu ăn</div>
                <Button className={globalstyles['add-button']} onClick={handleAddButtonClick}>Thêm mới</Button>
                <div className={globalstyles.flexRow}>
                    <img src={Arrow} alt="Previous Day" className={styles.arrowIcon} style={{ transform: 'rotate(180deg)' }} onClick={handlePreviousDay} />
                    <div>
                        <Form.Control
                            style={{ width: '200px', cursor: 'pointer' }}
                            aria-label="DD/MM/yy"
                            aria-describedby="basic-addon1"
                            type="date" 
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <img src={Arrow} alt="Next Day" className={styles.arrowIcon} onClick={handleNextDay} />
                    <Dropdown onSelect={handleMealSelection}>
                        <Dropdown.Toggle variant="light" id="dropdown-basic" className={styles.selectRole}>
                            {meal} 
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="breakfast">Sáng</Dropdown.Item>
                            <Dropdown.Item eventKey="lunch">Trưa</Dropdown.Item>
                            <Dropdown.Item eventKey="dinner">Tối</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <Table className={globalstyles['table-1300']}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: '2px' }}>
                            <th>STT</th>
                            <th>Tên món ăn</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipes.map((recipe, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center'}}>{index + 1}</td>
                                <td>{recipe.recipename}</td>
                                <td style={{ textAlign: 'center'}}>
                                    <select
                                        value={recipe.status}
                                        onChange={(e) => handleStatusChange(recipe, e.target.value)}
                                        style={{ cursor: 'pointer', border: 'none'}}
                                    >
                                        <option value="true">Hoàn thành</option>
                                        <option value="false">Chưa hoàn thành</option>
                                    </select>
                                </td>

                                <td style={{ textAlign: 'center', width: 'auto', height: '100%' }}>
                                    <div className={globalstyles['icon-container']} onClick={() => handleView(recipe)}>
                                        <FontAwesomeIcon color="white" icon={faEye} />
                                    </div>
                                    <div className={globalstyles['icon-container']} onClick={() => handleDelete(recipe)}>
                                        <FontAwesomeIcon color="white" icon={faTrash} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
            {/* Modal xóa món ăn */}
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
            {/* Modal Xem chi tiết món ăn */}
            <Modal show={showViewModal} onHide={handleViewModalClose} centered>
                <Modal.Title style={{textAlign: 'center', fontWeight: 'bold'}}>
                    {selectedRecipe && selectedRecipe.recipename}
                </Modal.Title>
                <Modal.Body>
                    <p><strong>Hướng dẫn</strong></p>
                    <p> {selectedRecipe && selectedRecipe.instructions}</p>
                    <p><strong>Nguyên liệu</strong></p>
                    <ul>
                        {selectedRecipe && selectedRecipe.item_ids && selectedRecipe.item_ids.map((item, index) => (
                            <li key={index}>{item.itemname}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleViewModalClose}>Đóng</Button>
                </Modal.Footer>
            </Modal>  
            {/* Modal thêm mới */}
            <Modal show={showAddModal} onHide={handleAddModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới món ăn</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{height: '210px'}}>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên món ăn"
                        value={newRecipe.recipename}
                        onChange={handleRecipeNameChange}
                    />
                    {searchResults.length > 0 && (
                        <Container className={styles['suggestion-container']}>
                            <div style={{ fontWeight: 'bold', color: 'red' }}>Hãy chọn món ăn</div>
                            <ul>
                                {searchResults.map(result => (
                                    <li key={uuidv4()} onClick={() => handleSelectRecipeName(result.recipeid, result.recipename)} style={{ cursor: 'pointer' }}>
                                        {result.recipename}
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    )}             
                </Modal.Body>
                <Modal.Footer> 
                    <Button variant="primary" onClick={handleAddModalConfirm}>Xác nhận</Button>
                    <Button variant="danger" onClick={handleAddModalClose}>Hủy</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
