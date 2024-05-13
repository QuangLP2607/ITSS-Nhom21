import React, { useState, useEffect } from 'react'; 
import { Container , Button, Table, Form, Modal } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './ShoppingList.module.css';
import Pagination from '../../components/pagination/pagination';
import UpdateIcon from '../../../assets/img/Update.png';
import DeleteIcon from '../../../assets/img/Delete.png';
import Arrow from '../../../assets/img/Arrow.png';
import { v4 as uuidv4 } from 'uuid';

export const ShoppingList = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);
    const [newItem, setNewItem] = useState({
        itemid: '',
        itemname: '',
        quantity: '',
        note: '',
        status: ''
    });
    const [isNewItemRowVisible, setIsNewItemRowVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const groupId = localStorage.getItem('groupId'); 
    //-------------------------------------------------------
    //-------------------Lấy API item-------------------
    const fetchSearchItems = async () => {
        try {
            let response = await axios.get(`/users/shoppingitems?groupid=${groupId}&dateadded=${selectedDate}`);
            const responseData = response.data;
            const pageCount = responseData.totalPages || 1; 
            setItems(responseData.shoppingItems);
            setTotalPages(pageCount);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };
    
    useEffect(() => {
        fetchSearchItems();
    }, [selectedDate]);
    //-------------------------------------------------------
    //-------------------Thêm item-------------------
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

    const handleAddButtonClick = () => {
        setIsNewItemRowVisible(true);
    };
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\D/g, '');
        setNewItem({ ...newItem, quantity: filteredValue });
    };

    const handleItemNameChange = (e) => {
        const value = e.target.value;
        const filteredResults = listItems.filter(item => {
            const searchString = `${item.itemname}`;
            return searchString.includes(value);
        }).slice(0, 5);
        setSearchResults(filteredResults);
        setNewItem({ ...newItem, itemname: value });
    };

    const handleSelectItemName = (selectedItemid, selectedItemName) => {
        setNewItem({ ...newItem, itemid: selectedItemid, itemname: selectedItemName });
        setSearchResults([]);
    };
    
    const handleConfirmButtonClick = async () => {
        if (newItem.itemname && newItem.quantity && newItem.note && newItem.status) {
            setItems(prevItems => [...prevItems, { ...newItem, id: items.length + 1 }]);
            setCurrentPage(totalPages);
            setIsNewItemRowVisible(false);
            localStorage.getItem('groupId')
            await addToDatabase(); 
        } else {
            setShowAlert(true);
        }
        console.log('New Item:', newItem);
    };
    
    const addToDatabase = async () => {  
        try {
            const response = await axios.post('/users/shoppingitems', {
                ...newItem,
                dateadded: selectedDate,
                groupid: localStorage.getItem('groupId')
            });
            
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };
    
    //-------------------------------------------------------
    //-------------------Xử lý chọn ngày-------------------
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
    
    //-------------------------------------------------------
    //-------------------Delete Update item-------------------
    const handleDelete = (itemId) => {

        setItemToDelete(itemId);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = (itemId) => {
        
        
        setShowDeleteConfirmation(false);
    };
    
    const handleUpdate = () => {

    };
    //-------------------------------------------------------
    //----------------Chuyển page-----------------------
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    return (
        <div>
            <Sidebar/>
            <Container fluid className={globalstyles['main-background']}>
                <div className={globalstyles['left-title']}>Danh sách mua sắm</div>
                <Button className={globalstyles['add-button']} variant="dark" onClick={handleAddButtonClick}>Thêm mới</Button>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px', marginLeft: '50px' }}>
                    <img src={Arrow} alt="Previous Day" style={{ cursor: 'pointer', marginRight: '10px', width: '20px', height: '20px', transform: 'rotate(180deg)' }} onClick={handlePreviousDay} />
                    <div style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <Form.Control 
                            style={{ width: '200px' }}
                            aria-label="DD/MM/yy"
                            aria-describedby="basic-addon1"
                            type="date" 
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    <img src={Arrow} alt="Next Day" style={{ cursor: 'pointer', width: '20px', height: '20px', marginLeft: '10px' }} onClick={handleNextDay} />
                </div>
                <Table className={globalstyles['table-1300']}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: '2px' }}>
                            <th>STT</th>
                            <th>Tên thực phẩm</th>
                            <th>Số lượng</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice((currentPage - 1) * 10, currentPage * 10).map((item, index) => (
                            <tr key={uuidv4()}>
                                <td style={{ textAlign: 'center'}}>{index + 1}</td>
                                <td>{item.itemname}</td>
                                <td style={{ textAlign: 'center'}}>{item.quantity}</td>
                                <td style={{ textAlign: 'center'}}>{item.note}</td>
                                <td style={{ textAlign: 'center' }}>{item.status ? 'Đã mua' : 'Chưa mua'}</td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div className={globalstyles['img-button-container']} >
                                        <img src={UpdateIcon} alt="Update" onClick={handleUpdate} className={globalstyles['img-button']} />
                                    </div>
                                    <div className={globalstyles['img-button-container']} style={{marginLeft:'10px'}}>
                                        <img src={DeleteIcon} alt="Delete"  onClick={() => handleDelete(item.id)} className={globalstyles['img-button']} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {/* Add new row with input fields and confirm button */}
                        {isNewItemRowVisible && (
                            <tr style={{ border: 'none' }}>
                                <td></td>
                                <td>
                                    <input 
                                        type="text" 
                                        value={newItem.itemname} 
                                        onChange={handleItemNameChange}
                                        placeholder="Tên thực phẩm"
                                        style={{ border: 'none' }} 
                                    />
                                    {searchResults.length > 0 && (
                                        <Container className={styles['suggestion-container']}>
                                        <div style ={{fontWeight: 'bold',  color: 'red'}}>Hãy chọn thực phẩm</div>
                                        <ul>
                                            {searchResults.map(result => (
                                                <li key={uuidv4()} onClick={() => handleSelectItemName(result.itemid, result.itemname)}>
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
                                    style={{ border: 'none' }}> 
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
            {/* Modal for showing alert */}
            <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thông báo</Modal.Title>
                </Modal.Header>
                <Modal.Body>Vui lòng điền đầy đủ thông tin trước khi xác nhận.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
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
