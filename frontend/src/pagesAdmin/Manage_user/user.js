import React, { useState, useEffect } from 'react';
import { Container, Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { Header } from '../../components/Layouts/Header/AdminHeader';
import Sidebar_admin from '../../components/Layouts/Sidebar/Sidebar_admin';
import globalstyles from '../../CSSglobal.module.css';
import styles from './User.module.css';
import useFetchListUsers from '../../components/hooks/useFetchUsersList';
import Pagination from '../../components/pagination/pagination';
import { Icon } from '@iconify/react';

export const Manage_user = () => {
    const listUsers = useFetchListUsers();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState(''); 

    useEffect(() => {
        setTotalPages(Math.ceil(listUsers.length / 10));
    }, [listUsers]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const resetUserPassword = (user) => {
        setSelectedUser(user); 
        setShowModal(true); 
    };

    const handleConfirmPasswordChange = async () => {
        try {
            if (selectedUser) {
                let response = await axios.post(`/admin/resetPassword`, { userid: selectedUser.userid });
                const newPassword = response.data.newPassword;
                console.log(`New password for user ${selectedUser.userid}: ${newPassword}`);
                setNewPassword(newPassword); 
                setShowModal(true); 
            }
        } catch (error) {
            console.error('Error resetting user password:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewPassword(''); 
    };

    const handleCancelModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <Header />
            <Sidebar_admin />
            <Container fluid className={globalstyles['main-background']}>
                <div className={styles['title']}>
                    <div className={globalstyles.title}>Danh sách người dùng</div>
                </div>
                <Table className={globalstyles['table-1300']}>
                    <thead>
                        <tr style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <th>STT</th>
                            <th>ID</th>
                            <th>Tên người dùng</th>
                            <th>Email</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsers.slice((currentPage - 1) * 10, currentPage * 10).map((user, index) => (
                            <tr key={user.userid} style={{ textAlign: 'center' }}>
                                <td>{index + 1 + (currentPage - 1) * 10}</td>
                                <td>{user.userid}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <div className={globalstyles['icon-container']} onClick={() => resetUserPassword(user)}>
                                        <Icon style={{ color: 'white', fontSize: '25px' }} icon="fluent:password-reset-48-filled" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
            </Container>

            {/* Modal for confirming password change */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận reset mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {newPassword ? (
                        <p>Mật khẩu mới của người dùng {selectedUser.username} là: <strong>{newPassword}</strong></p>
                    ) : (
                        <p>Bạn có chắc chắn muốn đổi mật khẩu cho người dùng ?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                {newPassword ? (
                         <Button variant="danger" onClick={handleCloseModal}>Đóng</Button>
                    ) : (
                        <>
                            <Button variant="primary" onClick={handleConfirmPasswordChange}>Xác nhận</Button>
                            <Button variant="danger" onClick={handleCancelModal}>Hủy</Button>
                        </>
                    )}
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
};
