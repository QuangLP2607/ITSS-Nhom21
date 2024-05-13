import React, { useState } from 'react';
import { Navbar, Dropdown} from 'react-bootstrap'; 
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const shouldShowGreeting = location.pathname !== '/';

    const handleLogout = () => {
        try {
            axios.get('/users/logout');
            console.log('Logged out successfully');
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangePassword = () => {
        
    };

    return (
        <Navbar className={styles['header-background']}>
            <Navbar.Brand className={styles["header-title"]}>Gia đình 360</Navbar.Brand>
            {shouldShowGreeting && (
                <Dropdown className={styles["header-user"]}>
                    <Dropdown.Toggle variant="dark" style={{ border: 'none' }} id="dropdown-basic">
                        Xin chào user
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item style={{ fontSize: '14px', padding: '5px 10px'}}>Đổi mật khẩu</Dropdown.Item>
                        <Dropdown.Item style={{ fontSize: '14px', padding: '5px 10px'}} onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </Navbar>
    );
};
