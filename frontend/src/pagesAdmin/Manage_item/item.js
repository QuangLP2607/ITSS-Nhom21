import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar_admin from '../../components/Layouts/Sidebar/Sidebar_admin';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Item.module.css';
import Pagination from '../../components/pagination/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

export const Manage_item = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [editItemId, setEditItemId] = useState(null);
    const [editItemName, setEditItemName] = useState('');
    const [editTimeExpired, setEditTimeExpired] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, [currentPage]); // Trigger fetchItems when currentPage changes

    const fetchItems = async (searchTerm = '') => {
        try {
            let endpoint = 'http://localhost:5000/admin/items';
            if (searchTerm.trim() !== '') {
                endpoint += `?searchTerm=${searchTerm}`;
            }
            const response = await axios.get(endpoint);
            const itemData = response.data;
            setItems(itemData);
            setTotalPages(Math.ceil(itemData.length / 10));
        } catch (error) {
            console.error('Error fetching Items:', error);
        }
    };

    const handleEditClick = (itemid, itemname, timeexpired) => {
        setEditItemId(itemid);
        setEditItemName(itemname);
        setEditTimeExpired(timeexpired.toString()); // Convert to string if timeexpired is a number
    };

    const handleSaveClick = async (itemid) => {
        try {
            await axios.patch(`http://localhost:5000/admin/items?id=${itemid}`, {
                itemname: editItemName,
                timeexpired: editTimeExpired
            });
            
            // Update the item locally
            const updatedItems = items.map(item => {
                if (item.itemid === itemid) {
                    return {
                        ...item,
                        itemname: editItemName,
                        timeexpired: editTimeExpired
                    };
                }
                return item;
            });

            setItems(updatedItems);
            setEditItemId(null); // Reset edit mode
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleCancelClick = () => {
        setEditItemId(null); // Reset edit mode
    };

    const handleDeleteClick = async (itemid) => {
        try {
            await axios.delete(`http://localhost:5000/admin/items?id=${itemid}`);
            const updatedItems = items.filter(item => item.itemid !== itemid);
            setItems(updatedItems);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div>
            <Sidebar_admin />
            <Container fluid className={globalstyles['main-background']}>
                <div className={styles['title']}>
                    <div className={globalstyles.title}>Quản lí thực phẩm</div>
                    <Button className={globalstyles.addButton} variant="primary" style={{ marginRight: 'auto' }}>Thêm mới</Button>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginLeft: '50px' }}>
                    <input
                        className={globalstyles.input}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nhập tên thực phẩm"
                    />
                    <Button className={globalstyles.smallButton} variant="primary">Tìm kiếm</Button>
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
                                <td style={{ textAlign: 'center' }}>
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
                                                onClick={() => handleCancelClick()}
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
                                            <div
                                                className={globalstyles['icon-container']}
                                                onClick={() => handleDeleteClick(item.itemid)}
                                            >
                                                <FontAwesomeIcon color="white" icon={faTrash} />
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
            </Container>
        </div>
    );
};
