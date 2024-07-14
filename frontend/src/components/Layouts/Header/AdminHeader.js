import React from 'react';
import { Navbar } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Header.module.css';

export const Header = () => {

    return (
        <Navbar className={styles['header-background']}>
            <div className={styles["header-title"]}>Trang quản lý Gia đình 360</div>
            <ToastContainer />
        </Navbar>
    );
};
