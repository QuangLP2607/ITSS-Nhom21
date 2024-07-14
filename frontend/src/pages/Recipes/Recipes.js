import React, { useState, useEffect, useContext } from 'react'; 
import { Container, Button, Table, Modal } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import {Header} from '../../components/Layouts/Header/Header';
import Pagination from '../../components/pagination/pagination';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Recipes.module.css';
import useFetchListItems from '../../components/hooks/useFetchItemList';
import useFetchListRecipes from '../../components/hooks/useFetchRecipesList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserIdContext } from '../../components/context/UserIdAndGroupIdContext';

export const Recipes = () => {
    const [inputRecipe, setInputRecipe] = useState('');
    const listItems = useFetchListItems();
    const listRecipes = useFetchListRecipes();
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const { userId } = useContext(UserIdContext);

    useEffect(() => {
        setFilteredRecipes(listRecipes); 
    }, [listRecipes]);

    //-------------------------------------------------------
    //-------------------Search recipe-----------------------
    const [favoriteRecipe, setFavoriteRecipe] = useState(false);
    const [inputTag, setInputTag] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);

    useEffect(() => {
        if (inputTag.trim() !== '') {
            const suggestions = listItems
                .filter(item => item.itemname.toLowerCase().includes(inputTag.toLowerCase()) && !selectedTags.includes(item.itemname))
                .slice(0, 8); 
            setSuggestedTags(suggestions);
        } else {
            setSuggestedTags([]);
        }
    }, [inputTag, listItems, selectedTags]);

    const inputRecipeName = (event) => {
        setInputRecipe(event.target.value);
    };

    const inputTagName = (event) => {
        setInputTag(event.target.value);
    };

    const addTag = (tag) => {
        setSelectedTags(prevTags => [...prevTags, tag]);
        setInputTag('');
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
    };

    useEffect(() => {
        const filtered = listRecipes.filter(recipe => 
            recipe.recipename.toLowerCase().includes(inputRecipe.toLowerCase()) &&
            (selectedTags.length === 0 || selectedTags.every(tag => recipe.item_ids.some(item => item.itemname === tag)))
        );
        setFilteredRecipes(filtered);
    }, [inputRecipe, selectedTags, listRecipes]);

    //-------------------------------------------------------
    //-------------------Favorite recipe---------------------
    const [listFavoriteRecipes, setListFavoriteRecipes] = useState([]);

    const SelectFavoriteRecipe = () => {
        setFavoriteRecipe(!favoriteRecipe);
    };

    useEffect(() => {
        const fetchListFavoriteRecipes = async () => {
            try {
                const response = await axios.get(`/users/favoriterecipes?userid=${userId}`);
                if (response.data && response.data.favoriteRecipes) {
                    setListFavoriteRecipes(response.data.favoriteRecipes);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchListFavoriteRecipes();
    }, []);

    useEffect(() => {
        if (favoriteRecipe) {
            const filtered = listRecipes.filter(recipe => 
                listFavoriteRecipes.some(fav => fav.recipeid === recipe.recipeid)
            );
            setFilteredRecipes(filtered);
        } else {
            setFilteredRecipes(listRecipes);
        }
    }, [favoriteRecipe, listRecipes, listFavoriteRecipes]);
    
    //-------------------------------------------------------
    //-------------------handle View-------------------------
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
    //---------------------handle Heart----------------------
    const handleHeart = (recipeid) => {
        if (listFavoriteRecipes.some(fav => fav.recipeid === recipeid)) {
            removeFavoriteRecipe(recipeid);
            setListFavoriteRecipes(prevList => prevList.filter(fav => fav.recipeid !== recipeid));
        } else {
            addFavoriteRecipe(recipeid); 
            setListFavoriteRecipes(prevList => [...prevList, { recipeid }]);
        }          
    };
    
    const addFavoriteRecipe = async (recipeid) => {
        try {
            const userid = userId;  
            await axios.post('/users/favoriterecipes', { userid, recipeid });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };    
    
    const removeFavoriteRecipe = async (recipeid) => {
        try {
            const userid = userId;  
            await axios.delete(`/users/favoriterecipes?userid=${userid}&recipeid=${recipeid}`);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }; 

    //-------------------------------------------------------
    //----------------Chuyển page----------------------------
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredRecipes.length / 10));
    }, [filteredRecipes]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Header/>
            <Sidebar/>
            <Container fluid className={globalstyles['main-background']}>
                <div className={globalstyles['left-title']}>Danh sách công thức nấu ăn</div>
                {/* <Button className={globalstyles.addButton}>Thêm mới</Button> */}

                <div style={{ display: 'flex', gap: '20px', marginLeft: '50px' }}>
                    <input type="text" className={globalstyles.input} value={inputRecipe} onChange={inputRecipeName} placeholder="Nhập tên món ăn" />
                    <div>
                        <input type="text" className={globalstyles.input} value={inputTag} onChange={inputTagName} placeholder="Nhập nguyên liệu"/>
                        {inputTag && (
                            <div className={styles['tag-suggestions']}>
                                {suggestedTags.filter(item => item.itemname.toLowerCase().includes(inputTag.toLowerCase())).map(filteredItem => (
                                    <div key={filteredItem.itemid} onClick={() => addTag(filteredItem.itemname)} className={styles['tag-suggestion']}>
                                        {filteredItem.itemname}
                                    </div>
                                ))}
                            </div>
                        )}   
                    </div>
                    <div className={styles['favorite-recipe']} onClick={() => SelectFavoriteRecipe()} 
                        style ={{color:favoriteRecipe ? 'red': 'white'}}>
                        Công thức yêu thích 
                        <FontAwesomeIcon color={ favoriteRecipe ? "red" : "white"} icon={faHeart} style={{marginLeft: '10px'}}/>
                    </div>
                </div>

                <div className={styles['selected-tags']}>
                    {selectedTags.map(tag => (
                        <span key={tag} className={styles['tag']}>
                            {tag}
                            <span onClick={() => removeTag(tag)} className={styles['remove-tag']}> <FontAwesomeIcon color="red" icon={faTimes} /></span>
                        </span>
                    ))}
                </div>
                
                <Table className={globalstyles['table-1000']} style={{ marginTop: '30px' }}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <th>STT</th>
                            <th>Tên món ăn</th>
                            <th>Nguyên liệu</th>
                            <th style={{ width: '130px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecipes.slice((currentPage - 1) * 10, currentPage * 10).map((recipe, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{index + 1 + (currentPage - 1) * 10}</td>
                                <td style={{ width: 'auto' }}>{recipe.recipename}</td>
                                <td style={{ width: 'auto', textAlign: 'center' }}>
                                    {recipe.item_ids.map((item, index) => (
                                        <span key={index} className={styles.tag}>{item.itemname}</span>
                                    ))}
                                </td>
                                <td style={{ textAlign: 'center', width: 'auto', height: '100%' }}>
                                    <div className={globalstyles['icon-container']} onClick={() => handleView(recipe)}>
                                        <FontAwesomeIcon color="white" icon={faEye} />
                                    </div>
                                    <div className={globalstyles['icon-container']} onClick={() => handleHeart(recipe.recipeid)}>
                                        <FontAwesomeIcon color={listFavoriteRecipes.some(fav => fav.recipeid === recipe.recipeid) ? "red" : "white"} icon={faHeart} />
                                    </div>
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
                    <Modal.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {selectedRecipe && selectedRecipe.recipename}
                    </Modal.Title>
                    <Modal.Body>
                        <p><strong>Hướng dẫn</strong></p>
                        <p>{selectedRecipe && selectedRecipe.instructions}</p>
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
