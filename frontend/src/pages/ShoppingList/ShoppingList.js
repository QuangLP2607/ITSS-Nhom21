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

export const ShoppingList = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [status, setStatus] = useState('');
    const [newItem, setNewItem] = useState({
        id: '',
        itemName: '',
        quantity: '',
        note: '',
        status: ''
    });
    const [isNewItemRowVisible, setIsNewItemRowVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    
    //-------------------------------------------------------
    //-------------------Lấy API item-------------------
    useEffect(() => {
        fetchSearchItems();
    }, []); 
    
    const fetchSearchItems = async () => {
        try {
            let response = await axios.get(`/admin/student`);
            const ItemData = response.data.students;
            const pageCount = Math.ceil(ItemData.length / 10);
            setItems(ItemData);
            setTotalPages(pageCount);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };
    //-------------------------------------------------------
    //-------------------Thêm item-------------------
    const handleAddButtonClick = () => {
        setIsNewItemRowVisible(true);
    };
    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\D/g, '');
        setQuantity(filteredValue);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleItemNameChange = (e) => {
        const value = e.target.value;
        const filteredResults = items.filter(item => {
            const searchString = `${item.id}`;
            return searchString.includes(value);
        }).slice(0, 5);
        setSearchResults(filteredResults);
        setNewItem({ ...newItem, itemName: value });
    };

    const handleSelectItemName = (selectedItemName) => {
        setNewItem({ ...newItem, itemName: selectedItemName });
        setSearchResults([]);
    };

    const handleConfirmButtonClick = () => {
        if (newItem.itemName && quantity && newItem.note && status) {
            setItems(prevItems => [...prevItems, { ...newItem, id: items.length + 1 }]);
            setNewItem({
                itemName: '',
                quantity: '',
                note: '',
                status: ''
            });
            setCurrentPage(totalPages);
            setIsNewItemRowVisible(false);
        } else {
            setShowAlert(true);
        }
    };
    //-------------------------------------------------------
    //-------------------Xử lý chọn ngày-------------------
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
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
        setSelectedDate(currentDate.toISOString().substr(0, 10));
    };
    //-------------------------------------------------------
    //-------------------Delete Update item-------------------
    const handleDelete = (itemId) => {
        setItemToDelete(itemId);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = (itemId) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
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
                            <tr key={item.id}>
                                <td style={{ textAlign: 'center'}}>{item.id}</td>
                                <td>{item.first_name} {item.last_name}</td>
                                <td style={{ textAlign: 'center'}}>{item.program_id}</td>
                                <td style={{ textAlign: 'center'}}>{item.cpa_total_score_product}</td>
                                <td>{item.email}</td>
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
                                        value={newItem.itemName} 
                                        onChange={handleItemNameChange}
                                        placeholder="Tên thực phẩm"
                                        style={{ border: 'none' }} 
                                    />
                                    {searchResults.length > 0 && (
                                        <div className={styles['suggestion-container']}>
                                        <div>Hãy chọn thực phẩm</div>
                                        <ul>
                                            {searchResults.map(result => (
                                                <li key={result.id} onClick={() => handleSelectItemName(result.id)}>
                                                    {result.id}
                                                </li>
                                            ))}
                                        </ul>
                                        </div>
                                    )}                       
                                </td>
                                <td>
                                    <input 
                                        type="text"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        placeholder="Số lượng"
                                        style={{ border: 'none',textAlign: 'center', width: '100%'}} 
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={newItem.note}
                                        onChange={(e) => setNewItem({ ...newItem, note: e.target.value })} 
                                        
                                        placeholder="Nhập ghi chú"
                                        style={{ border: 'none' }} // Bỏ viền cho input
                                    />
                                </td>
                                <td style={{ textAlign: 'center'}}> 
                                    <select value={status} onChange={handleStatusChange} style={{ border: 'none' }}> {/* Bỏ viền cho select */}
                                        <option value="">Trạng thái</option>
                                        <option value="Đã mua">Đã mua</option>
                                        <option value="Chưa mua">Chưa mua</option>
                                    </select>
                                </td>
                                <td><Button variant="dark" onClick={handleConfirmButtonClick}>Xác nhận</Button></td>
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
