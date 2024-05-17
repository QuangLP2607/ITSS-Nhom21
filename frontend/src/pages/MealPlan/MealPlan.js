import React, { useState, useEffect } from 'react'; 
import { Container, Row, Form, Button, Table, Modal } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './MealPlan.module.css';
import ViewIcon from '../../../assets/img/View.png';
import DeleteIcon from '../../../assets/img/Delete.png';
import Arrow from '../../../assets/img/Arrow.png';
import { v4 as uuidv4 } from 'uuid';
import useFetchListRecipes from '../../components/hooks/useFetchRecipesList';

export const MealPlan = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [meal, setMeal] = useState('breakfast');
    const [recipes, setRecipes] = useState([]);
    const listRecipes = useFetchListRecipes();
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [searchResults, setSearchResults] = useState([]);

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

    const handleMealSelection = (event) => {
        const selectedMeal = event.target.value;
        setMeal(selectedMeal);
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
                groupid: localStorage.getItem('groupId'),
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
    }, [listRecipes, selectedDate, meal, localStorage.getItem('groupId')]);
    
    const fetchRecipes = async () => {
        try {
            let response = await axios.get(`/users/mealplan?dateadded=${selectedDate}&mealtype=${meal}&groupid=${localStorage.getItem('groupId')}`);
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
           <Sidebar/>
           <Container fluid className={globalstyles['main-background']}>
                <div className={globalstyles['left-title']}>Kế hoạch nấu ăn</div>
                <Button className={globalstyles['add-button']} variant="dark" onClick={handleAddButtonClick}>Thêm mới</Button>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginLeft: '50px' }}>
                    <img src={Arrow} alt="Previous Day" style={{ cursor: 'pointer', marginRight: '10px', width: '20px', height: '20px', transform: 'rotate(180deg)' }} onClick={handlePreviousDay} />
                    <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <Form.Control
                            style={{ width: '150px' }}
                            aria-label="DD/MM/yy"
                            aria-describedby="basic-addon1"
                            type="date" 
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <img src={Arrow} alt="Meal Select" style={{ cursor: 'pointer', width: '20px', height: '20px', marginLeft: '10px' }} onClick={handleNextDay} />
                    <select value={meal} onChange={handleMealSelection} style={{border: '1px solid #ced4da', borderRadius: '5px', padding: '6px', marginLeft: '50px'}}>
                        <option value="breakfast">Sáng</option>
                        <option value="lunch">Trưa</option>
                        <option value="dinner">Tối</option>
                    </select>
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
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div className={globalstyles['img-button-container']}>
                                        <img src={ViewIcon} alt="View" onClick={() => handleView(recipe)} className={globalstyles['img-button']}/>
                                    </div>
                                    <div className={globalstyles['img-button-container']} style={{marginLeft:'10px'}}>
                                        <img src={DeleteIcon} alt="Delete"  onClick={() => handleDelete(recipe)} className={globalstyles['img-button']}/>
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
