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
        fetchGroup();
    }, []); 
    
    const fetchGroup = async () => {
        try {
            const userId = localStorage.getItem('userId');  
            let response = await axios.get(`/users/group?userid=${userId}`);
            const GroupData = response.data.groupID;
            console.log('Groups:', GroupData); 
            setGroups(GroupData);
        } catch (error) {
            console.error('Error fetching groups:', error); 
        }
    };
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
           <div style = {{marginTop: '50px', marginLeft: '10vw', width: '60vw'}}>
           {groups.map((group, index) => (
                <div 
                    key={index} 
                    style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px 0', cursor: 'pointer' }} 
                    onClick={() => handleGroupClick(group.groupid)}
                >
                    <div>
                        <span>{index + 1}</span>
                        <span style={{ marginLeft: '30px', fontWeight: 'bold', fontSize: '20px' }}>{group.groupname}</span>
                        <span style={{ marginLeft: '30px' }}>Group ID: {group.groupid}</span>
                    </div>
                </div>
            ))}
            </div>
            </Container>
        </div>
    );
};
