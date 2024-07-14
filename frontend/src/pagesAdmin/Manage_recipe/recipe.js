import React, { useState, useEffect, useContext } from 'react'; 
import { Container, Button, Table, Modal, Form } from 'react-bootstrap'; 
import {Header} from '../../components/Layouts/Header/AdminHeader'
import axios from 'axios';
import Sidebar_admin from '../../components/Layouts/Sidebar/Sidebar_admin';
import useFetchListItems from '../../components/hooks/useFetchItemList';
import useFetchListRecipes from '../../components/hooks/useFetchRecipesList';
import { UserIdContext } from '../../components/context/UserIdAndGroupIdContext';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Recipe.module.css';
import Pagination from '../../components/pagination/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Manage_recipe = () => {
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

   

    useEffect(() => {
            setFilteredRecipes(listRecipes);
    }, [listRecipes]);
    
    //-------------------------------------------------------
    //-------------------handle Edit-------------------------
    const [inputTag1, setInputTag1] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRecipe, setEditRecipe] = useState({
        recipename: '',
        instructions: '',
        item_ids: []
    });

    const handleEdit = (recipe) => {
        setEditRecipe(recipe);
        setShowEditModal(true);
    };

    const removeEditItem = (item) => {
        setEditRecipe((prevState) => ({
            ...prevState,
            item_ids: prevState.item_ids.filter(tag => tag !== item)
        }));
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleEditRecipe = async () => {
        console.log(editRecipe);
    }
  
    const handleTagClick1 = (tag) => {
        setEditRecipe(prevState => ({
            ...prevState,
            item_ids: [...prevState.item_ids, tag]
        }));
        setInputTag1('');
    };

    const inputTagName1 = (event) => {
        setInputTag1(event.target.value);
    };

    useEffect(() => {
        if (inputTag1.trim() !== '') {
            const suggestions = listItems
                .filter(item => item.itemname.toLowerCase().includes(inputTag1.toLowerCase()) && !selectedTags.includes(item.itemname))
                .slice(0, 8); 
            setSuggestedTags(suggestions);
        } else {
            setSuggestedTags([]);
        }
    }, [inputTag1, listItems, selectedTags]);

   //-------------------------------------------------------
    //-------------------handle View-------------------------

    
    //-------------------------------------------------------
    //-------------------handle Add-------------------------
    const [inputTag2, setInputTag2] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newRecipe, setNewRecipe] = useState({
        recipename: '',
        instructions: '',
        item_ids: []
    });
    
    const removeAddItem = (item) => {
        setNewRecipe((prevState) => ({
            ...prevState,
            item_ids: prevState.item_ids.filter(tag => tag !== item)
        }));
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
    };

    const handleAddRecipe = async () => {
        console.log(newRecipe);
        try {
            const response = await axios.post('/admin/recipes',newRecipe);
            if (response.status === 200) {
                toast.success('Thêm công thức nấu ăn thành công !');
                newRecipe({ recipename: '', instructions: '' });
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
        setShowAddModal(false);
    };
    
    const handleTagClick2 = (tag) => {
        setNewRecipe(prevState => ({
            ...prevState,
            item_ids: [...prevState.item_ids, tag]
        }));
        setInputTag2('');
    };

    const inputTagName2 = (event) => {
        setInputTag2(event.target.value);
    };

    useEffect(() => {
        if (inputTag2.trim() !== '') {
            const suggestions = listItems
                .filter(item => item.itemname.toLowerCase().includes(inputTag2.toLowerCase()) && !selectedTags.includes(item.itemname))
                .slice(0, 8); 
            setSuggestedTags(suggestions);
        } else {
            setSuggestedTags([]);
        }
    }, [inputTag2, listItems, selectedTags]);

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
            <Sidebar_admin/>
            <Container fluid className={globalstyles['main-background']}>
                <div >
                    <div className={globalstyles.title}>Danh sách công thức nấu ăn</div>
                    <Button className={globalstyles.addButton} variant="primary" onClick={() =>setShowAddModal(true)}>Thêm mới</Button>
                </div>

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
                            <th>hướng dẫn</th>
                            <th>Nguyên liệu</th>
                            <th style={{ width: '130px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecipes.slice((currentPage - 1) * 10, currentPage * 10).map((recipe, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{index + 1 + (currentPage - 1) * 10}</td>
                                <td style={{ width: 'auto' }}>{recipe.recipename}</td>
                                <td style={{ width: 'auto' }}>{recipe.instructions}</td>
                                <td style={{ width: 'auto', textAlign: 'center' }}>
                                    {recipe.item_ids.map((item, index) => (
                                        <span key={index} className={styles.tag}>{item.itemname}</span>
                                    ))}
                                </td>
                                <td style={{ textAlign: 'center', width: 'auto', height: '100%' }}>
                                    <div className={globalstyles['icon-container']} onClick={() => handleEdit(recipe)}>
                                        <FontAwesomeIcon color="white" icon={faEdit} />
                                    </div>
                                    <div className={globalstyles['icon-container']} onClick={() => handleEdit(recipe)}>
                                        <FontAwesomeIcon color="white" icon={faTrash} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                </Table>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
                {/* Modal chỉnh sửa món ăn */}
                <Modal show={showEditModal} onHide={handleEditModalClose} centered>
                    <Modal.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        <input type="text" 
                            className={styles.inputName} 
                            value={editRecipe.recipename} 
                            onChange={(e) => setEditRecipe(prevState => ({
                                ...prevState,
                                recipename: e.target.value
                            }))}
                            placeholder="Nhập tên công thức nấu ăn"
                        />
                    </Modal.Title>
                    <Modal.Body>
                        <p><strong>Hướng dẫn</strong></p>
                        <textarea type="text" 
                            className={styles.inputInstructions} 
                            value={editRecipe.instructions} 
                            onChange={(e) => setEditRecipe(prevState => ({
                                ...prevState,
                                instructions: e.target.value
                            }))}
                            placeholder="Nhập hướng dẫn"
                        />
                        <div>
                            <p><strong>Tìm kiếm nguyên liệu</strong></p>
                            
                            <input type="text" className={globalstyles.input} value={inputTag1} onChange={inputTagName1} placeholder="Nhập nguyên liệu"/>
                            {inputTag1 && (
                                <div className={styles['tag-suggestions']}>
                                    {suggestedTags
                                        .filter(item => item.itemname.toLowerCase().includes(inputTag1.toLowerCase()))
                                        .map(filteredItem => (
                                            <div
                                                key={filteredItem.itemid}
                                                onClick={() => handleTagClick1(filteredItem)}
                                                className={styles['tag-suggestion']}
                                            >
                                                {filteredItem.itemname}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                        <p style={{marginTop: '15px'}}><strong>Nguyên liệu</strong></p>
                        <ul>
                            {editRecipe && editRecipe.item_ids && editRecipe.item_ids.map((item, index) => (
                                <li key={index} style={{ position: 'relative' }}>
                                    {item.itemname}
                                    <span 
                                        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                        onClick={() => removeEditItem(item)}
                                    >
                                        <FontAwesomeIcon color="red" icon={faTimes} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleEditRecipe}>Xác nhận</Button>
                    <Button variant="danger" onClick={handleEditModalClose}>Hủy</Button>
                    </Modal.Footer>
                </Modal>
                {/* Modal thêm mới món ăn */}
                <Modal show={showAddModal} onHide={handleAddModalClose} centered>
                    <Modal.Title style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        <input type="text" 
                            className={styles.inputName} 
                            value={newRecipe.recipename} 
                            onChange={(e) => setNewRecipe(prevState => ({
                                ...prevState,
                                recipename: e.target.value
                            }))}
                            placeholder="Nhập tên công thức nấu ăn"
                        />
                    </Modal.Title>
                    <Modal.Body>
                        <p><strong>Hướng dẫn</strong></p>
                        <textarea type="text" 
                            className={styles.inputInstructions} 
                            value={newRecipe.instructions} 
                            onChange={(e) => setNewRecipe(prevState => ({
                                ...prevState,
                                instructions: e.target.value
                            }))}
                            placeholder="Nhập hướng dẫn"
                        />
                        <div>
                            <p><strong>Tìm kiếm nguyên liệu</strong></p>
                            
                            <input type="text" className={globalstyles.input} value={inputTag2} onChange={inputTagName2} placeholder="Nhập nguyên liệu"/>
                            {inputTag2 && (
                                <div className={styles['tag-suggestions']}>
                                    {suggestedTags
                                        .filter(item => item.itemname.toLowerCase().includes(inputTag2.toLowerCase()))
                                        .map(filteredItem => (
                                            <div
                                                key={filteredItem.itemid}
                                                onClick={() => handleTagClick2(filteredItem)}
                                                className={styles['tag-suggestion']}
                                            >
                                                {filteredItem.itemname}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                        <p><strong>Nguyên liệu</strong></p>
                        <ul>
                            {newRecipe && newRecipe.item_ids && newRecipe.item_ids.map((item, index) => (
                                <li key={index} style={{ position: 'relative' }}>
                                    {item.itemname}
                                    <span 
                                        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                        onClick={() => removeAddItem(item)}
                                    >
                                        <FontAwesomeIcon color="red" icon={faTimes} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleAddRecipe}>Xác nhận</Button>
                    <Button variant="danger" onClick={handleAddModalClose}>Hủy</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
   );
};