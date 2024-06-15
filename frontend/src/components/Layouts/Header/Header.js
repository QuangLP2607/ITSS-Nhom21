import React, { useState, useRef, useEffect, useContext } from 'react';
import { Navbar, Dropdown, Popover, OverlayTrigger, Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Header.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { UserIdContext, GroupIdContext } from '../../context/UserIdAndGroupIdContext';

export const Header = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [showInvitationModal, setShowInvitationModal] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const shouldShowGreeting = location.pathname !== '/';
    const bellRef = useRef(null);
    const { groupId } = useContext(GroupIdContext);
    const { userId } = useContext(UserIdContext);

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
        if (shouldShowGreeting && groupId) {
            fetchExpiryAlert();
        }
    }, [groupId, shouldShowGreeting, userId]);

    useEffect(() => {
        const fetchGroupInvitations = async () => {
            try {
                const response = await axios.get(`/users/groupinvitation?userid=${userId}`);
                if (response.data && response.data.groupInvitation) {
                    setArlert1s(response.data.groupInvitation);
                    response.data.groupInvitation.forEach(alert => {
                        toast.info(`You have a new group invitation from ${alert.groupid}`);
                    });
                }
            } catch (error) {
                console.error('Error fetching group invitation:', error);
            }
        };
        fetchGroupInvitations();
    }, []);

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

    const calculateDaysRemaining = (alertDate) => {
        const currentDate = new Date();
        const expiryDate = new Date(alertDate);
        const timeDiff = expiryDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        return daysDiff;
    };

    const handleBellClick = () => {
        setShowNotification(prevState => !prevState);
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

    const handleInvitationClick = (invitation) => {
        setSelectedInvitation(invitation);
        setShowInvitationModal(true);
    };

    const handleReplyInvitation = async (status) => {
        try {
            await axios.patch(`/users/groupinvitation?invitationid=${selectedInvitation.invitationid}`, {
                status: status
            });
            if (status === "accept") {
                toast.success(`Accepted invitation to ${selectedInvitation.groupname}`);
            } else if (status === "reject") {
                toast.success(`Rejected invitation to ${selectedInvitation.groupname}`);
            }
            setShowInvitationModal(false);
        } catch (error) {
            console.error('Error replying to invitation:', error);
            toast.error('Failed to reply to the invitation');
        }
    };
    
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
                    </tbody>
                </table>
            </Popover.Body>
        </Popover>
    );

    return (
        <Navbar className={styles['header-background']}>
            <div className={styles["header-title"]}>Gia đình 360</div>
            {shouldShowGreeting && (
                <div className={styles["header-user-container"]}>
                    {arlert1s.length > 0 && (
                        <div className={styles['invitation-bubble']} onClick={() => setShowInvitationModal(true)}>
                            <span className={styles['invitation-count']}>{arlert1s.length}</span>
                        </div>
                    )}
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
                            <div className={styles['notification-count']}>{arlerts.length}</div>
                        )}
                    </div>
                    </OverlayTrigger>
                    <Dropdown className={styles["header-user"]}>
                        <Dropdown.Toggle style={{ border: 'none' }} id="dropdown-basic">
                            Xin chào user
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item style={{ fontSize: '14px', padding: '5px 10px'}} onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
            <ToastContainer />
            <Modal show={showInvitationModal} onHide={() => setShowInvitationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Lời mời tham gia nhóm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInvitation ? (
                        <div>
                            <p>Bạn có một lời mời tham gia nhóm <strong>{selectedInvitation.groupname}</strong>.</p>
                            <p>Mô tả: {selectedInvitation.description}</p>
                        </div>
                    ) : (
                        <div>
                            {arlert1s.map((alert, index) => (
                                <div key={index} className={styles['invitation-item']}>
                                    <span>{alert.groupname}</span>
                                    <Button variant="primary" onClick={() => handleInvitationClick(alert)}>Xem</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                {selectedInvitation  && (
                    <Modal.Footer>
                        <Button variant="success" onClick={() => handleReplyInvitation("accept")}>Chấp nhận</Button>
                        <Button variant="danger" onClick={() => handleReplyInvitation("reject")}>Từ chối</Button>
                    </Modal.Footer>
                )}
            </Modal>
        </Navbar>
    );
};
