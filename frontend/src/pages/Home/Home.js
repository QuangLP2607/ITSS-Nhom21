import React, { useState, useEffect, useContext} from 'react'; 
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap'; 
import {Header} from '../../components/Layouts/Header/Header'
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Home.module.css';
import { UserIdContext, GroupIdContext } from '../../components/context/UserIdAndGroupIdContext';
import useFetchListUsers from '../../components/hooks/useFetchUsersList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Home = () => {
    
    //--------------------------------------------------------
    //--------------Lấy danh sách thành viên-------------------
    const { groupId } = useContext(GroupIdContext);
    const { userId } = useContext(UserIdContext);
    const [members, setMembers] = useState([]);
    const listUsers = useFetchListUsers();

    useEffect(() => {
        fetchMember(); 
    }, []); 

    const fetchMember = async () => {
        try {
            let response = await axios.get(`/users/groupmember?groupid=${groupId}`);
            const groupMember = response.data.groupMember;
            setMembers(groupMember);
        } catch (error) {
            console.error('Error fetching groups:', error); 
        }
    };

    //------------------------------------------------------------
    //--------------------Tìm kiếm user---------------------------
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        handleSearch();
    }, [searchTerm]);

    const handleSearch = () => {
        if (searchTerm) {
            const filteredUsers = listUsers.filter(user =>
                (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
                !selectedMembers.some(member => member.userid === user.userid)
            );
            setSuggestions(filteredUsers);
        } else {
            setSuggestions([]);
        }
    };

    const handleAddMember = (member) => {
        if (!selectedMembers.some(m => m.userid === member.userid)) {
            setSelectedMembers([...selectedMembers, member]);
            setSearchTerm('');
        }
    };

    const handleRemoveMember = (memberToRemove) => {
        const updatedMembers = selectedMembers.filter(member => member.userid !== memberToRemove.userid);
        setSelectedMembers(updatedMembers);
    };

    //--------------------------------------------------------
    //--------------Thêm thành viên vào nhóm------------------
    const [showAddMember, setShowAddMember] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleSendInvitation = async () => {
        try {
            await sendGroupInvitations(userId, groupId, selectedMembers);
        } catch (error) {
            console.error('Error create group:', error);
        }
        setShowAddMember(false);
        toast.success('Đã gửi lời mời đến người dùng !');
    };

    const sendGroupInvitations = async (userId, groupId, selectedMembers) => {
        try {
            await Promise.all(selectedMembers.map(member => {
                return axios.post('/users/groupinvitation', {
                    senderid: userId,
                    groupid: groupId,
                    receiverid: member.userid
                });
            }));
        } catch (error) {
            console.error('Error sending group invitations:', error);
            throw error;
        }
    };
  
    return (
        <div>
            <Header/>
           <Sidebar/>
           <Container fluid className={globalstyles['main-background']}>
                <div className={styles.flexRow}>
                    <div>Hôm nay ăn gì</div>
                    <div className={styles.listUser}>
                        <div className={styles.addMemberContainer}>
                            <Button className={styles.addMember} onClick={() => setShowAddMember(true)}>Thêm thành viên</Button>
                        </div>
                        <hr style={{margin: '5px'}}/>
                        <strong style={{ display: 'block', textAlign: 'center', fontSize: '18px', marginBottom: '10px' }}>
                            Danh sách thành viên
                        </strong>
                        <div>
                            {members.map((member) => (
                                <div key={member.userid}>
                                    {member.username} ({member.email})
                                </div>
                            ))}
                        </div>
                       
                    </div>
                </div>
               {/*Modal thêm thành viên */}
                <Modal show={showAddMember} onHide={() => setShowAddMember(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Thêm thành viên</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height: '300px'}}>
                        <Form>
                        <Form.Group controlId="formGroupMembers">
                            <Form.Label style={{ marginTop: '10px' }}>Tìm kiếm người dùng:</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên hoặc email"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="primary" onClick={handleSearch}>
                                        Tìm kiếm
                                    </Button>
                                </Col>
                            </Row> 
                        </Form.Group>   
                            {suggestions.length > 0 && (
                                <div className={styles.suggestions}>
                                    {suggestions.map((user, index) => (
                                        <div
                                            key={index}
                                            className={styles.suggestion_item}
                                            onClick={() => handleAddMember(user)}
                                        >
                                            {user.username} ({user.email})
                                        </div>
                                    ))}
                                </div>
                            )}     
                            <Form.Label style={{ marginTop: '10px' }}> Thành Viên: </Form.Label>
                            {selectedMembers.length > 0 && (
                                <div className={styles.selected_members}>
                                    <ul>
                                    {selectedMembers.map((member, index) => (
                                        <li key={index} style={{ position: 'relative' }}>
                                            <span style={{ marginRight: '5px', display: 'inline-block' }}>{member.username} ({member.email})</span>
                                            <FontAwesomeIcon 
                                                color="#800000" 
                                                icon={faTimes} 
                                                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                onClick={() => handleRemoveMember(member)} 
                                            />
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSendInvitation}>
                            Xác nhận
                        </Button>
                        <Button variant="danger" onClick={() => setShowAddMember(false)}>
                            Hủy
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};