import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MenuIcon from '../../../../assets/img/Menu.jpg';
import styles from './Sidebar.module.css';

const Sidebar_admin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(window.innerWidth > 1000); 
    const [showOverlay, setShowOverlay] = useState(false); 

    const handleLogout = () => {
        try {
            axios.get('/admin/logout');
            console.log('Logged out successfully');
            localStorage.clear();
            navigate('/loginAdmin');
        } catch (error) {
            console.log(error);
        }
    };

    const handleHamburgerButtonClick = () => {
        const shouldShow = !showMenu && window.innerWidth <= 1000;
        setShowMenu(shouldShow);
        setShowOverlay(shouldShow); 
    };

    const handleOutsideClick = (event) => {
        if (!event.target.closest(`.${styles['left-content']}`) && showMenu && window.innerWidth <= 1000) {
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
            setShowOverlay(false); 
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div>
            {!showMenu && (
                <div className={styles['hamburger-button']} onClick={handleHamburgerButtonClick}>
                    <img src={MenuIcon} alt="Menu" style={{ width: '100%', height: '100%', borderRadius: '5px' }} />
                </div>
            )}
            {showOverlay && <div className={styles['overlay']} onClick={handleHamburgerButtonClick}></div>}
            <div className={`${styles['left-content']} ${showMenu ? styles['show'] : ''}`}>
                <ul className={styles['sitemap']} onClick={window.innerWidth <= 1000 ? handleHamburgerButtonClick : null}>
                    <li><NavLink to="/manage_item" className={location.pathname.includes('/manage_item') ? styles.active : ''}>Thực phẩm</NavLink></li>
                    <hr className={styles.separator} />
                    <li><NavLink to="/manage_recipe" className={location.pathname.includes('/manage_recipe') ? styles.active : ''}>Công thức nấu ăn</NavLink></li>
                    <hr className={styles.separator} />
                    <li><NavLink to="/manage_group" className={location.pathname.includes('/manage_group') ? styles.active : ''}>Nhóm</NavLink></li>
                    <hr className={styles.separator} />
                    
                    <li><Button variant="primary" onClick={handleLogout} className={styles.logoutButton}>Đăng xuất</Button></li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar_admin;