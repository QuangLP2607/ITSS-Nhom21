import React, { useState, useEffect } from 'react';
import { Col, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '../../../../assets/img/Menu.jpg';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(window.innerWidth > 1000); // Ban đầu hiển thị sidebar
    const [showOverlay, setShowOverlay] = useState(false); // Trạng thái hiển thị lớp phủ

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

    const handleHamburgerButtonClick = () => {
        setShowMenu(!showMenu && window.innerWidth <= 1000);
        setShowOverlay(!showMenu && window.innerWidth <= 1000); // Hiển thị lớp phủ khi ẩn sidebar
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest('.left-content') && showMenu && window.innerWidth <= 1000) {
            setShowMenu(false);
            setShowOverlay(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [showMenu]);

    useEffect(() => {
        const handleResize = () => {
            setShowMenu(window.innerWidth > 1000);
            setShowOverlay(false); // Ẩn lớp phủ khi resize màn hình
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Col>
            {!showMenu && (
                <div className={styles['hamburger-button']} onClick={handleHamburgerButtonClick}>
                    <img src={MenuIcon} alt="Menu" style={{ width: '100%', height: '100%', borderRadius: '5px' }} />
                </div>
            )}
            {showOverlay && <div className={styles['overlay']} onClick={handleHamburgerButtonClick}></div>}
            <div className={`${styles['left-content']} ${showMenu ? styles['show'] : ''}`}>
                <ul className={styles['sitemap']} onClick={window.innerWidth <= 1000 ? handleHamburgerButtonClick : null}>
                    <li><NavLink to="/home">Trang chủ</NavLink></li>
                    <li><NavLink to="/shoppingList">Danh sách mua sắm</NavLink></li>
                    <li><NavLink to="/mealPlan">Kế hoạch nấu ăn</NavLink></li>
                    <li><NavLink to="/foodStorage">Tủ lạnh</NavLink></li>
                    <li><NavLink to="/recipes">Công thức nấu ăn</NavLink></li>
                    <li><Button variant="primary" onClick={handleLogout} className={styles['logout-button']}>Đăng xuất</Button></li>
                </ul>
            </div>
        </Col>
    );
};

export default Sidebar;
