import React, { useState, useRef, useEffect, useContext } from 'react';
import { Navbar, Dropdown, Popover, OverlayTrigger, Modal, Button} from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Header.module.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { UserIdContext, GroupIdContext } from '../../context/UserIdAndGroupIdContext';
import { Icon } from '@iconify/react';

export const Header = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [showInvitationModal, setShowInvitationModal] = useState(false);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const navigate = useNavigate();
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
            fetchExpiryAlert();

    }, [groupId, userId]);

    useEffect(() => {
        const fetchGroupInvitations = async () => {
            try {
                const response = await axios.get(`/users/groupinvitation?userid=${userId}`);
                if (response.data && response.data.groupInvitation) {
                    setArlert1s(response.data.groupInvitation);
                    response.data.groupInvitation.forEach(alert => {
                        // toast.info(`You have a new group invitation from ${alert.groupid}`);
                    });
                }
            } catch (error) {
                console.error('Error fetching group invitation:', error);
            }
        };
        fetchGroupInvitations();
    }, [handleReplyInvitation]);

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

    const calculateDaysRemaining = (alertdate) => {
        const currentDate = new Date();
        const alertDate = new Date(alertdate);
        const timeDiff = alertDate.getTime() - currentDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
        
        if (daysDiff < 0) {
            return `đã quá hạn ${Math.abs(daysDiff)} ngày`;
        } else {
            return `hết hạn sau ${daysDiff} ngày`;
        }
    };

    const handleBellClick = () => {
        setShowNotification(prevState => !prevState);
    };
 
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

    const handleConfirm = async (alert) => {
        try {
            await axios.patch(`/users/expiryAlert?alertid=${alert.alertid}`, {
                status: 'confirm'
            });
            
            // Update local state to reflect the change
            const updatedAlerts = arlerts.map(a => {
                if (a.alertid === alert.alertid) {
                    return { ...a, status: 'confirm' };
                }
                return a;
            });
            setArlerts(updatedAlerts);
        } catch (error) {
            console.error('Error updating alert status:', error);
        }
    };

    
    const notificationPopover = (
        <Popover id="notification-popover">
            <Popover.Header as="h3" className="text-center">Thông báo</Popover.Header>
            <Popover.Body>
                <table>
                    <tbody>
                        {arlerts.map((alert, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleConfirm(alert)}>
                                    {alert.status === 'pending' ? (
                                        <strong>{alert.itemname} - {calculateDaysRemaining(alert.alertdate)}</strong>
                                    ) : (
                                        <span>{alert.itemname} - {calculateDaysRemaining(alert.alertdate)}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Popover.Body>
        </Popover>
    );


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        return `Ngày gửi: ${year}-${month}-${day} lúc ${hours}:${minutes} '`;
    };

    return (
        <Navbar className={styles['header-background']}>
            <div className={styles["header-title"]}>Gia đình 360</div>
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
                        {arlerts.filter(alert => alert.status === 'pending').length > 0 && (
                            <div className={styles['notification-count']}>{arlerts.filter(alert => alert.status === 'pending').length}</div>
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
            <ToastContainer />
            <Modal show={showInvitationModal} onHide={() => setShowInvitationModal(false)} centered>
                <Modal.Header closeButton>
                    {selectedInvitation && (
                        <Button variant="link" onClick={() => setSelectedInvitation(false)} className="p-0">
                            <Icon icon="material-symbols:arrow-back-ios-rounded" color="black" width="24" height="24" />
                        </Button>
                    )}
                    <Modal.Title className="mx-auto">Lời mời tham gia nhóm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInvitation ? (
                        <div>
                            <p >Bạn có một lời mời tham gia nhóm <strong>{selectedInvitation.groupname}</strong>.</p>
                            <p>Người gửi: {selectedInvitation.username}</p>
                            <p>{formatDate(selectedInvitation.createdat)}</p>
                        </div>
                    ) : (
                        <div>
                            {arlert1s.map((alert, index) => (
                                <div key={index} className={'d-flex justify-content-between align-items-center'}>
                                    <span>Group: <strong>{alert.groupname}</strong></span>
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
