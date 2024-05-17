import React, { useState, useEffect } from 'react'; 
import { Container , Button, Table, Modal } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import Pagination from '../../components/pagination/pagination';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Recipes.module.css';
import useFetchListRecipes from '../../components/hooks/useFetchRecipesList';
import ViewIcon from '../../../assets/img/View.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export const Recipes = () => {
    const [inputRecipe, setInputRecipe] = useState('');
    const listRecipes = useFetchListRecipes();
    
    const inputRecipeName = (event) => {
        setInputRecipe(event.target.value);
    };

    const handleSearchButtonClick = () => {
    
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
    //----------------Chuyển page----------------------------
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    
    return (
        <div>
           <Sidebar/>
           <Container fluid className={globalstyles['main-background']}>
           <div className={globalstyles['left-title']}>Danh sách sinh viên</div>
                <Link to="/addStudent"><Button className={globalstyles['add-button']}variant="dark">Thêm mới</Button></Link>
                <div className={globalstyles['search-input']}>
                    <input type="text" value={inputRecipe} onChange={inputRecipeName} placeholder="Nhập teen món ăn" style={{marginRight: '10px'}}/>
                    <Button className={globalstyles['button-search']} variant="dark" onClick={handleSearchButtonClick}>Tìm kiếm</Button> 
                </div>
            
            <Table className={globalstyles['table-1000']} style={{ marginTop: '80px' }}>
                <thead>
                    <tr style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <th>STT</th>
                        <th>Tên món ăn</th>
                        <th>Nguyên liệu</th>
                        <th style={{ width: '130px' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listRecipes.slice((currentPage - 1) * 10, currentPage * 10).map((recipe, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{index + 1}</td>
                            <td style={{ width: 'auto' }}>{recipe.recipename}</td>
                            <td style={{ width: 'auto', textAlign: 'center' }}>
                            {recipe.item_ids.map((item, index) => (
                                        <span key={index} className={styles.tag}>{item.itemname}</span>
                                    ))}
                            </td>
                            <td style={{ textAlign: 'center', width: 'auto', height: '100%' }}>
                                <React.Fragment>
                                    <div className={globalstyles['img-button-container']} >
                                        <img src={ViewIcon} alt="View" onClick={() => handleView(recipe)} style={{ width: '100%', height: '100%' }} />
                                    </div>   
                                    <div className={styles['heart-container']} >
                                        <div className={styles['heart-inner']}>
                                            <FontAwesomeIcon icon={faHeart} color="red" style={{ width: '60%', height: '60%' }} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>
                <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
            </div>
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
            </Container>
        </div>
    );
};
