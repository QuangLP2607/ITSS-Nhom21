import React, { useState, useEffect, useContext } from 'react'; 
import { Container, Button, Table, Form, Modal } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './ShoppingList.module.css';
import Pagination from '../../components/pagination/pagination';
import Arrow from '../../../assets/img/Arrow.png';
import useFetchListItems from '../../components/hooks/useFetchItemList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GroupIdContext } from '../../components/context/UserIdAndGroupIdContext';
import {Header} from '../../components/Layouts/Header/Header'

export const ShoppingList = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState([]);
    const listItems = useFetchListItems();
    const [showAlert, setShowAlert] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const { groupId } = useContext(GroupIdContext);

    //-------------------------------------------------------------
    //-------------------Lấy danh sách item------------------------
    const fetchSearchItems = async () => {
        try {
            let response = await axios.get(`/users/shoppingitems?groupid=${groupId}&dateadded=${selectedDate}`);
            const responseData = response.data;
            
            setItems(responseData.shoppingItems);
            const pageCount = Math.ceil(responseData.shoppingItems.length / 10);
            setTotalPages(pageCount);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };
    
    useEffect(() => {
        fetchSearchItems();
    }, [selectedDate]);

    //-------------------------------------------------------
    //-------------------Add item----------------------------
    const [isNewItemRowVisible, setIsNewItemRowVisible] = useState(false);
    const [newItem, setNewItem] = useState({
        shoppingitemid:'',
        itemid: '',
        itemname: '',
        quantity: '',
        note: '',
        status: ''
    });

    // Ngăn cho ô input quantity nhập số
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\D/g, '');
        setNewItem({ ...newItem, quantity: filteredValue });
    };

    const handleItemNameChange = (e) => {
        const value = e.target.value.toLowerCase(); 
        const filteredResults = listItems.filter(item => {
            const searchString = item.itemname.toLowerCase(); 
            return searchString.includes(value);
        }).slice(0, 15);
        setSearchResults(filteredResults);
        setNewItem({ ...newItem, itemname: value });
    };
    
    const handleSelectItemName = (selectedItemid, selectedItemName) => {
        setNewItem({ ...newItem, itemid: selectedItemid, itemname: selectedItemName });
        setSearchResults([]);
    };

    const handleAddButtonClick = () => {
        setIsNewItemRowVisible(true);
    };
    
    const handleConfirmButtonClick = async () => {
        if (newItem.itemname && newItem.quantity && newItem.quantity !== '0' && newItem.status) {
            await addToDatabase(); 
            fetchSearchItems();
            setIsNewItemRowVisible(false);
            setNewItem({shoppingitemid: '',itemid: '',itemname: '',quantity: '',note: '',status: ''});
        } else {
            setShowAlert(true);
        }
    };
    
    const addToDatabase = async () => {  
        try {
            const response = await axios.post('/users/shoppingitems', {
                ...newItem,
                dateadded: selectedDate,
                groupid: groupId
            });
            return response.data.newShoppingItemId;
        } catch (error) {
            console.error('Error adding item:', error);
            throw error; 
        }
    };
    
    //-------------------------------------------------------
    //-------------------Delete item-------------------------
    const handleDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteConfirmation(true);
    };
    
    const handleDeleteConfirmed = async (itemToDelete) => {
        try {
            await axios.delete(`/users/shoppingitems?shoppingitemid=${itemToDelete.shoppingitemid}`);
            setItems(prevItems => prevItems.filter(item => item.shoppingitemid !== itemToDelete.shoppingitemid));
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    
    //-------------------------------------------------------
    //-------------------Update item-------------------------
    const [editingItem, setEditingItem] = useState({
        shoppingitemid: '',
        quantity: '',
        note: '',
        status: ''
    });
    
    const handleUpdateClick = (item) => {
        setEditingItem(prevEditingItem => ({
            ...prevEditingItem,
            shoppingitemid: item.shoppingitemid,
            quantity: item.quantity,
            note: item.note,
            status: item.status
        }));
    };
    
    const handleEditItemChange = (field, value) => {
        setEditingItem(prevItem => ({
            ...prevItem,
            [field]: value
        }));
    };
    
    const [quantityError, setQuantityError] = useState(false);

    const handleUpdate = () => {
        if (!editingItem.quantity || editingItem.quantity === '0') {
            setQuantityError(true);
            return;
        }
        axios.patch(`/users/shoppingitems?shoppingitemid=${editingItem.shoppingitemid}`, editingItem)
            .then(() => {
                fetchSearchItems();   
                handleCancelEdit();
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
    };
    
    const handleQuantityChange1 = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\D/g, ''); 
        setEditingItem(prevItem => ({ ...prevItem, quantity: filteredValue }));
        setQuantityError(false);
    };
    
    const handleCancelEdit = () => {
        setEditingItem({
            shoppingitemid: '',
            quantity: '',
            note: '',
            status: ''
        });
    };

    //-------------------------------------------------------
    //----------------Chuyển page----------------------------
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    //-------------------------------------------------------
    //-------------------Xử lý chọn ngày---------------------
    const handleDateChange = async (event) => {
        const newDate = event.target.value;  
        setSelectedDate(newDate);
        setIsNewItemRowVisible(false);
    };
    
    const handlePreviousDay = async () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        setSelectedDate(currentDate.toISOString().slice(0, 10));
        setIsNewItemRowVisible(false);
    };
    
    const handleNextDay = async () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        setSelectedDate(currentDate.toISOString().slice(0, 10));
        setIsNewItemRowVisible(false);
    };
    
    return (
        <div>
            <Header></Header>
            <Sidebar/>
            <Container fluid className={globalstyles['main-background']}>
                <div className={globalstyles['left-title']}>Danh sách mua sắm</div>
                <Button className={globalstyles['add-button']} onClick={handleAddButtonClick}>Thêm mới</Button>
                <div className={globalstyles.flexRow}>
                    <img src={Arrow} alt="Previous Day"  className={styles.arrowIcon} style={{ transform: 'rotate(180deg)' }} onClick={handlePreviousDay} />
                    <div style={{ marginLeft: '10px', marginRight: '10px'}}>
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
                </div>
                {quantityError && <p style={{ color: 'red' }}>Số lượng không thể bằng 0. Vui lòng nhập một giá trị hợp lệ.</p>}
                <Table className={globalstyles['table-1300']}>
                    <thead>
                        <tr style={{ textAlign: 'center',  whiteSpace: 'nowrap' }}>
                            <th style ={{width: '60px'}}>STT</th>
                            <th style ={{width: '150px'}}>Tên thực phẩm</th>
                            <th style ={{width: '110px'}}>Số lượng</th>
                            <th>Ghi chú</th>
                            <th style ={{width: '140px'}}>Trạng thái</th>
                            <th style ={{width: '115px'}}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice((currentPage - 1) * 10, currentPage * 10).map((item, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ width: 'auto' }}>{item.itemname}</td>
                                <td style={{ width: 'auto', textAlign: 'center' }}>
                                    {editingItem.shoppingitemid === item.shoppingitemid ? (
                                        <input
                                            type="text"
                                            value={editingItem.quantity}
                                            onChange={handleQuantityChange1}
                                            style={{ textAlign: 'center', border: 'none', maxWidth: '70px' }}
                                        />
                                    ) : (
                                        item.quantity
                                    )}
                                </td>
                                <td style={{ width: 'auto' }}>
                                    {editingItem.shoppingitemid === item.shoppingitemid ? (
                                        <input
                                            type="text"
                                            value={editingItem.note !== null ? editingItem.note : ''}
                                            onChange={(e) => handleEditItemChange('note', e.target.value)}
                                            style={{ width: '100%', border: 'none' }}
                                        />
                                    ) : (
                                        item.note
                                    )}
                                </td>
                                <td style={{ width: 'auto', textAlign: 'center' }}>
                                    {editingItem.shoppingitemid === item.shoppingitemid ? (
                                        <select
                                            value={editingItem.status}
                                            onChange={(e) => handleEditItemChange('status', e.target.value)}
                                            style={{ cursor: 'pointer', border: 'none'}}
                                        >
                                            <option value="true">Đã mua</option>
                                            <option value="false">Chưa mua</option>
                                        </select>
                                    ) : (
                                        item.status ? 'Đã mua' : 'Chưa mua'
                                    )}
                                </td>
                                <td style={{ textAlign: 'center', width: 'auto', height: '100%' }}>
                                    {editingItem.shoppingitemid === item.shoppingitemid ? (
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
                                            <div className={globalstyles['icon-container']} onClick={() => handleUpdateClick(item)}>
                                                <FontAwesomeIcon color="white" icon={faEdit} />
                                            </div>
                                            <div className={globalstyles['icon-container']} onClick={() => handleDelete(item)}>
                                                <FontAwesomeIcon color="white" icon={faTrash} />
                                            </div>
                                        </React.Fragment>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {/* Add new row with input fields and confirm button */}
                        {isNewItemRowVisible && (
                            <tr  style={{ border: 'none' }}>
                                <td></td>
                                <td>
                                    <input 
                                        type="text" 
                                        value={newItem.itemname} 
                                        onChange={handleItemNameChange}
                                        placeholder="Tìm kiếm thực phẩm"
                                        style={{ border: 'none' }} 
                                    />
                                    {searchResults.length > 0 && (
                                        <Container className={styles['suggestion-container']}>
                                            <div style={{ fontWeight: 'bold', color: 'red' }}>Hãy chọn thực phẩm</div>
                                            <ul>
                                                {searchResults.map(result => (
                                                    <li key={result.itemid} onClick={() => handleSelectItemName(result.itemid, result.itemname)} style={{ cursor: 'pointer' }}>
                                                        {result.itemname}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Container>
                                    )}             
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        value={newItem.quantity}
                                        onChange={handleQuantityChange}
                                        placeholder="Số lượng"
                                        style={{ border: 'none', textAlign: 'center', width: '100%' }} 
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newItem.note}
                                        onChange={(e) => setNewItem({ ...newItem, note: e.target.value })} 
                                        placeholder="Nhập ghi chú"
                                        style={{ border: 'none' }} 
                                    />
                                </td>
                                <td style={{ textAlign: 'center'}}> 
                                    <select value={newItem.status} onChange={(e) => setNewItem({ ...newItem, status: e.target.value })} 
                                        style={{ border: 'none', cursor: 'pointer'}}> 
                                        <option value="">Trạng thái</option>
                                        <option value="true">Đã mua</option>
                                        <option value="false">Chưa mua</option>
                                    </select>
                                </td>
                                <td style={{ textAlign: 'center'}}>
                                    <Button variant="dark" onClick={handleConfirmButtonClick} 
                                        style={{ border: 'none', fontSize: '12px' }}>
                                        Xác nhận
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
            </Container>
            {/* Modal hiện nhắc nhở nhập đầy đủ thông tin */}
            <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    {newItem.quantity === '0' ? (
                        <p>Số lượng không thể bằng 0. Vui lòng nhập một giá trị hợp lệ.</p>
                        ) : (
                        <p>Vui lòng điền đầy đủ thông tin trước khi xác nhận.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal xác nhận delete */}
            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa mục này không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteConfirmed(itemToDelete)}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
