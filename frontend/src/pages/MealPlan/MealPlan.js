import React, { useState, useEffect } from 'react'; 
import { Container, Row, Form, Button, Table, Modal } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './MealPlan.module.css';
import ViewIcon from '../../../assets/img/View.png';
import DeleteIcon from '../../../assets/img/Delete.png';
import Arrow from '../../../assets/img/Arrow.png';

export const MealPlan = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [meal, setMeal] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [recipeToDelete, setRecipeToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [newRecipeName, setNewRecipeName] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    //-------------------Xử lý chọn ngày-------------------
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().substr(0, 10);
        setSelectedDate(formattedDate);
    }, []); 

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        console.log("Selected Date:", newDate);
        setSelectedDate(newDate);
    };

    const handlePreviousDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        setSelectedDate(currentDate.toISOString().slice(0, 10));
    };

    const handleNextDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        setSelectedDate(currentDate.toISOString().slice(0, 10));
    };

    const handleMealSelection = (event) => {
        const selectedMeal = event.target.value;
        setMeal(selectedMeal);
    };
    //-------------------------------------------------------
    //-------------------Thêm món ăn-------------------
    const handleAddButtonClick = () => {
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
    };

    const handleAddModalConfirm = () => {
        // Thực hiện logic để thêm món ăn mới
        // Sau khi thêm xong, đóng Modal
        setShowAddModal(false);
    };
    //-------------------------------------------------------
    //-------------------Lấy API món ăn-------------------
    useEffect(() => {
        fetchSearchRecipes();
    }, []); 
    
    const fetchSearchRecipes = async () => {
        try {
            let response = await axios.get(`/admin/student?email=quang@gmail.com`);
            const RecipeData = response.data.students;
            setRecipes(RecipeData);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };
    //-------------------------------------------------------
    //-------------------------------------------------------
    //-------------------Delete View recipe-------------------
    const handleDelete = (recipeId) => {
        setRecipeToDelete(recipeId);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = (recipeId) => {
        const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
        setRecipes(updatedRecipes);
        setShowDeleteConfirmation(false);
    };
    
    const handleView = (recipeId) => {
        setSelectedRecipe(recipeId);
        setShowViewModal(true);
    };

    const handleViewModalClose = () => {
        setShowViewModal(false);
    };
    //-------------------------------------------------------
    
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
                        <option value="">Chọn bữa</option>
                        <option value="Sáng">Sáng</option>
                        <option value="Trưa">Trưa</option>
                        <option value="Tối">Tối</option>
                    </select>
                </div>
                <Table className={globalstyles['table-1300']}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: '2px' }}>
                            <th>STT</th>
                            <th>Tên thực phẩm</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recipes.map((recipe) => (
                            <tr key={recipe.id}>
                                <td style={{ textAlign: 'center'}}>{recipe.id}</td>
                                <td>{recipe.first_name} {recipe.last_name}</td>
                                <td style={{ textAlign: 'center'}}>{recipe.program_id}</td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div className={globalstyles['img-button-container']} >
                                        <img src={ViewIcon} alt="View" onClick={() => handleView(recipe.id)} className={globalstyles['img-button']} />
                                    </div>
                                    <div className={globalstyles['img-button-container']} style={{marginLeft:'10px'}}>
                                        <img src={DeleteIcon} alt="Delete"  onClick={() => handleDelete(recipe.id)} className={globalstyles['img-button']} />
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
                <Modal.Header closeButton>
                    <Modal.Title>Tên món ăn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> </p>
                    <p>Ghi chú: </p>
                    <p>Nguyên liệu:</p>
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
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên món ăn"
                        value={newRecipeName}
                        onChange={(e) => setNewRecipeName(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer> 
                    <Button variant="primary" onClick={handleAddModalConfirm}>Xác nhận</Button>
                    <Button variant="danger" onClick={handleAddModalClose}>Hủy</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
