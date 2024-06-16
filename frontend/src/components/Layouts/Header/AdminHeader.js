import React, { useState, useRef, useEffect, useContext } from 'react';
import { Navbar, Dropdown, Popover, OverlayTrigger, Modal, Button} from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Header.module.css';
import axios from 'axios';


export const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            axios.get('/admin/logout');
            console.log('Logged out successfully');
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Navbar className={styles['header-background']}>
            <div className={styles["header-title"]}>Trang quản lý Gia đình 360</div>
                <div className={styles["header-user-container"]}>
                    <Dropdown className={styles["header-user"]}>
                        <Dropdown.Toggle style={{ border: 'none' }} id="dropdown-basic">
                            Xin chào user
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item style={{ fontSize: '14px', padding: '5px 10px'}} onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            <ToastContainer />
        </Navbar>
    );
};
