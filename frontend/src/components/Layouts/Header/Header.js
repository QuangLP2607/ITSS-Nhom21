import React, { useState, useRef, useEffect, useContext } from 'react';
import { Navbar, Dropdown, Popover, OverlayTrigger } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {  UserIdContext, GroupIdContext } from '../../context/UserIdAndGroupIdContext'

export const Header = () => {
    const [showNotification, setShowNotification] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const shouldShowGreeting = location.pathname !== '/';
    const bellRef = useRef(null);
    const { groupId } = useContext(GroupIdContext);
    const { userId } = useContext(UserIdContext);
    
    //--------------------------------------------------------------
    //----------------Đăng xuất-------------------------------------
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

    //---------------------------------------------------------------
    //----------------Đổi mật khẩu-----------------------------------
    const handleChangePassword = () => {
        // Handle change password
    };

    //---------------------------------------------------------------
    //----------------Thông báo--------------------------------------
    const [arlerts, setArlerts] = useState([]);
    const [arlert1s, setArlert1s] = useState([]);

    useEffect(() => {
        const fetchExpiryAlert = async () => {
            try {
                const response = await axios.get(`/users/expiryAlert?userid=${userId}&groupid=${groupId}`);
                if (response.data && response.data.Arlerts) {
                    setArlerts(response.data.Arlerts);
                }
            } catch (error) {
                console.error('Error fetching expiry alert:', error);
            }
        };
        if (shouldShowGreeting & groupId) {
            fetchExpiryAlert();
        }
    }, [groupId,shouldShowGreeting]);

    useEffect(() => {
        const fetchGroupInvitations = async () => {
            try {
                const response = await axios.get(`/users/groupinvitation?userid=${userId}`);
                if (response.data && response.data.groupInvitation) {
                    setArlert1s(response.data.groupInvitation);
                }
            } catch (error) {
                console.error('Error fetching group invitation:', error);
            }
        };
        if (userId) {
            fetchGroupInvitations();
            console.log("Arlert1s:", arlert1s);

        }
    }, [userId]);

    const calculateDaysRemaining = (alertDate) => {
        const currentDate = new Date();
        const expiryDate = new Date(alertDate);
        const timeDiff = expiryDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        return daysDiff;
    };

    const handleBellClick = () => {
        setShowNotification(!showNotification);
    };

    const handleClickOutside = (event) => {
        if (bellRef.current && !bellRef.current.contains(event.target)) {
            setShowNotification(false);
        }
    };

    useEffect(() => {
        if (showNotification) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotification]);

    const notificationPopover = (
        <Popover id="notification-popover">
            <Popover.Header as="h3">Thông báo</Popover.Header>
            <Popover.Body>
                <table>
                    <tbody>
                        {arlerts.map((alert, index) => (
                            <tr key={index}>
                                <td>{alert.itemname}</td>
                                <td>hết hạn sau {calculateDaysRemaining(alert.alertdate)} ngày</td>
                            </tr>
                        ))}
                        {/* {arlert1s.map((alert, index) => (
                            <tr key={index}>
                                <td>{alert.invitationid}</td>
                           
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </Popover.Body>
        </Popover>
    );

    return (
        <Navbar className={styles['header-background']}>
            <Navbar.Brand className={styles["header-title"]}>Gia đình 360</Navbar.Brand>
            {shouldShowGreeting && (
                <div className={styles["header-user-container"]}>
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={notificationPopover}
                        show={showNotification}
                    >
                        <div className={styles['bell-icon-container']} ref={bellRef}>
                            <FontAwesomeIcon 
                                className={styles['bell-icon']} 
                                icon={faBell} 
                                onClick={handleBellClick}
                            />
                            {arlerts.length > 0 && (
                                <div className={styles['notification-count']} > {arlerts.length}</div>
                            )}
                        </div>
                    </OverlayTrigger>
                    <Dropdown className={styles["header-user"]}>
                        <Dropdown.Toggle variant="dark" style={{ border: 'none' }} id="dropdown-basic">
                            Xin chào user
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item style={{ fontSize: '14px', padding: '5px 10px'}} onClick={handleChangePassword}>Đổi mật khẩu</Dropdown.Item>
                            <Dropdown.Item style={{ fontSize: '14px', padding: '5px 10px'}} onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
        </Navbar>
    );
};
