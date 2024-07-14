import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Header } from '../../components/Layouts/Header/AdminHeader';
import Sidebar_admin from '../../components/Layouts/Sidebar/Sidebar_admin';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Item.module.css';
import Pagination from '../../components/pagination/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Manage_item = () => {
    const [allItems, setAllItems] = useState([]);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editItemId, setEditItemId] = useState(null);
    const [editItemName, setEditItemName] = useState('');
    const [editTimeExpired, setEditTimeExpired] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    // lấy danh sách thực phẩm
    const fetchItems = async () => {
        try {
            const response = await axios.get(`admin/items`);
            const itemData = response.data;
            setAllItems(itemData);
            setItems(itemData);
            setTotalPages(Math.ceil(itemData.length / 10));
        } catch (error) {
            console.error('Error fetching Items:', error);
        }
    };
    
    const handleEditClick = (itemid, itemname, timeexpired) => {
        setEditItemId(itemid);
        setEditItemName(itemname);
        setEditTimeExpired(timeexpired.toString());
    };

    //-----------------------------------------------------------
    //------------------Cập nhật thực phẩm-----------------------
    const handleSaveClick = async (itemid) => {
        try {
            await axios.patch(`admin/items?id=${itemid}`, {
                itemname: editItemName,
                timeexpired: editTimeExpired
            });
            
            const updatedItems = items.map(item => {
                if (item.itemid === itemid) {
                    return { ...item, itemname: editItemName, timeexpired: editTimeExpired };
                }
                return item;
            });

            setItems(updatedItems);
            setEditItemId(null); 
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    //---------------------------------------------------------
    //-------------------Xóa thực phẩm-------------------------
    const handleDeleteClick = async (itemid) => {
        try {
            await axios.delete(`admin/items?id=${itemid}`);
            const updatedItems = items.filter(item => item.itemid !== itemid);
            setItems(updatedItems);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    //--------------------------------------------------------------
    //-------------------Thêm mới thực phẩm-------------------------
    const [isNewItemRowVisible, setIsNewItemRowVisible] = useState(false);
    const [newItem, setNewItem] = useState({
        itemname:'',
        timeexpired: ''
    });

    const handleTimeExpiredChange = (e) => {
        const value = e.target.value;
        const filteredValue = value.replace(/\D/g, '');
        setNewItem({ ...newItem, timeexpired: filteredValue });
    };

    const addItem = async () => {
        try {
            const response = await axios.post('/admin/items',newItem);
            if (response.status === 200) {
                setIsNewItemRowVisible(false); 
                toast.success('Thêm thục phẩm thành công !');
                setNewItem({ itemname: '', timeexpired: '' });
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    //----------------------------------------------------
    //-------------------tìm kiếm-------------------------
    useEffect(() => {
        const filteredItems = () => {
            const filtered = allItems.filter((item) => item.itemname.includes(searchTerm));
            setItems(filtered);
            setTotalPages(Math.ceil(filtered.length / 10));  
        };
        filteredItems();
    }, [searchTerm]);

    return (
        <div>
            <Header/>
            <Sidebar_admin />
            <Container fluid className={globalstyles['main-background']}>
                <div >
                    <div className={globalstyles.title}>Quản lí thực phẩm</div>
                    <Button className={globalstyles.addButton} variant="primary" onClick={() =>setIsNewItemRowVisible(true)}>Thêm mới</Button>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginLeft: '50px' }}>
                    <input
                        className={globalstyles.input}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập tên thực phẩm"
                    />
                </div>
                <Table className={globalstyles['table-1300']}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <th>Số thứ tự</th>
                            <th>Tên thực phẩm</th>
                            <th>Hạn sử dụng (đơn vị: ngày)</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.slice((currentPage - 1) * 10, currentPage * 10).map((item, index) => (
                            <tr key={item.itemid}>
                                <td style={{ textAlign: 'center' }}>{index + 1 + (currentPage - 1) * 10}</td>
                                <td>
                                    {editItemId === item.itemid ? (
                                        <Form.Control
                                            type="text"
                                            value={editItemName}
                                            onChange={(e) => setEditItemName(e.target.value)}
                                        />
                                    ) : (
                                        item.itemname
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {editItemId === item.itemid ? (
                                        <Form.Control
                                            type="text"
                                            value={editTimeExpired}
                                            onChange={(e) => setEditTimeExpired(e.target.value)}
                                        />
                                    ) : (
                                        item.timeexpired
                                    )}
                                </td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    {editItemId === item.itemid ? (
                                        <>
                                            <div
                                                className={globalstyles['icon-container']}
                                                onClick={() => handleSaveClick(item.itemid)}
                                            >
                                                <FontAwesomeIcon color="white" icon={faSave} />
                                            </div>
                                            <div
                                                className={globalstyles['icon-container']}
                                                onClick={() => setEditItemId(null)}
                                            >
                                                <FontAwesomeIcon color="white" icon={faTimes} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                className={globalstyles['icon-container']}
                                                onClick={() => handleEditClick(item.itemid, item.itemname, item.timeexpired)}
                                            >
                                                <FontAwesomeIcon color="white" icon={faEdit} />
                                            </div>
                                            {/* <div
                                                className={globalstyles['icon-container']}
                                                onClick={() => handleDeleteClick(item.itemid)}
                                            >
                                                <FontAwesomeIcon color="white" icon={faTrash} />
                                            </div> */}
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {isNewItemRowVisible && (
                            <tr style={{ border: 'none' }}>
                                <td></td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={newItem.itemname}
                                        onChange={(e) => setNewItem((prevState) => ({
                                            ...prevState,
                                            itemname: e.target.value
                                        }))}
                                    />     
                                </td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={newItem.timeexpired}
                                        onChange={handleTimeExpiredChange}
                                    />  
                                </td>
                                <td style={{ textAlign: 'center'}}>
                                    <Button variant="dark" onClick={addItem} 
                                        style={{ border: 'none', fontSize: '12px' }}>
                                        Xác nhận
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={(pageNumber) =>setCurrentPage(pageNumber)} />
                </div>
            </Container>
        </div>
    );
};