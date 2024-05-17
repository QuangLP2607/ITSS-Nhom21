import React, { useState, useEffect } from 'react'; 
import { Container , Row, Button, Dropdown } from 'react-bootstrap'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';; 
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import styles from './Group.module.css';

export const Group = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    //-------------------Lấy API nhóm-------------------
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const userId = localStorage.getItem('userId');  
                let response = await axios.get(`/users/group?userid=${userId}`);
                const GroupData = response.data.groupID;
                setGroups(GroupData);
            } catch (error) {
                console.error('Error fetching groups:', error); 
            }
        };
    
        fetchGroup(); // Gọi hàm fetchGroup ở đây
    }, []); 
    
    //---------------tạo hoặc tham gia nhóm-----------------------
    const handleCreateGroup = () => {
       
    };

    const handleJoinGroup = () => {
       
    };

    //-------------------------------------------------------
    //---------------chọn nhóm-----------------------
    const handleGroupClick = (groupId) => {
        localStorage.setItem('groupId', groupId);
        navigate('/home');
    };

    return (
        <div>
           <Container fluid className={styles['main-background']}>
            <div style={{ fontSize: '25px', fontWeight: 'bold' }}>Nhóm của bạn</div>
                <Dropdown className={styles['add-button']}>
                    <Dropdown.Toggle variant="dark" style={{ border: 'none', fontSize: '12px' }} id="dropdown-basic">
                        Tạo hoặc tham gia nhóm
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item style={{ fontSize: '14px'}}  onClick={handleCreateGroup}>Tạo nhóm</Dropdown.Item>
                        <Dropdown.Item style={{ fontSize: '14px'}}  onClick={handleJoinGroup} >Tham gia nhóm</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className={styles.gridContainer}>
                    {groups.map((group, index) => (
                        <div
                            key={index}
                            className={`${styles.groupItem} ${index === 0 ? styles.group1 : styles.group2}`} 
                            onClick={() => handleGroupClick(group.groupid)}
                        >
                            <div className={styles.groupContent}>
                                <span className={styles.groupName}>{group.groupname}</span>
                                <div className={styles.groupId}>Group ID: {group.groupid}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};
