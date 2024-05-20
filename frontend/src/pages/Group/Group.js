import React, { useState, useEffect, useRef, useContext } from 'react'; 
import { Container, Button, Dropdown, Modal, Form, Row, Col } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import styles from './Group.module.css';
import useFetchListUsers from '../../components/hooks/useFetchUsersList';
import { UserIdContext, GroupIdContext } from '../../components/context/UserIdAndGroupIdContext';

export const Group = () => {
    const listUsers = useFetchListUsers();
    const { setGroupId } = useContext(GroupIdContext);
    const { userId } = useContext(UserIdContext);
    const navigate = useNavigate();

    //-------------------Lấy danh sách nhóm-------------------
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroup(); 
    }, []); 

    const fetchGroup = async () => {
        try {
            let response = await axios.get(`/users/group?userid=${userId}`);
            const GroupData = response.data.groupID;
            setGroups(GroupData);
        } catch (error) {
            console.error('Error fetching groups:', error); 
        }
    };
    //-------------------------------------------------------
    //----------------------Tạo nhóm-------------------------
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [groupName, setGroupName] = useState('');

    const handleCreateGroup = async () => {
        try {
            const newGroupId = await createGroup(userId, groupName);
            await sendGroupInvitations(userId, newGroupId, selectedMembers);
        } catch (error) {
            console.error('Error create group:', error);
        }
        setShowCreateModal(false);
        fetchGroup();
    };

    const createGroup = async (userId, groupName) => {
        try {
            const response = await axios.post('/users/group', {
                userid: userId,
                groupname: groupName
            });
            return response.data.newGroupId;
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    };
    
    //--------------------Tìm kiếm user---------------------------
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = () => {
        if (searchTerm) {
            const filteredUsers = listUsers.filter(user =>
                user.username.toLowerCase() === searchTerm.toLowerCase() ||
                user.email.toLowerCase() === searchTerm.toLowerCase()
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
            setSuggestions([]);
        }
    };

    const handleRemoveMember = (memberToRemove) => {
        const updatedMembers = selectedMembers.filter(member => member !== memberToRemove);
        setSelectedMembers(updatedMembers);
    };
    //----------------Gửi lời mời cho user----------------------
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

    //-------------------------------------------------------
    //------------------Tham gia nhóm------------------------
    const [groupCode, setGroupCode] = useState('');
    const [showJoinModal, setShowJoinModal] = useState(false);

    const handleJoinGroup = async () => {
        try {
            await axios.post('/users/groupMember', { 
                userid: userId, 
                groupid: groupCode
            });
            setShowJoinModal(false);
            setGroupCode('');
            fetchGroup();
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    //-------------------------------------------------------
    //-------------------Chọn nhóm---------------------------
    const handleGroupClick = (groupid) => {
        setGroupId(groupid);
        navigate('/home');
    };

    //-------------------------------------------------------
    //-------------------Rời nhóm----------------------------
    const [showLeaveOption, setShowLeaveOption] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const leaveOptionRef = useRef(null); 

    const toggleLeaveOption = (group) => {
        setSelectedGroup(group);
        setShowLeaveOption(group); 
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (leaveOptionRef.current && !leaveOptionRef.current.contains(event.target)) {
                setShowLeaveOption(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleLeaveGroup = async () => {
        try {
            await axios.delete(`/users/groupMember?groupid=${selectedGroup.groupid}&userid=${userId}`);
            setShowLeaveOption(null);
            setShowDeleteConfirmation(false);
            fetchGroup();
        } catch (error) {
            console.error('Error deleting food:', error);
        }
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
                        <Dropdown.Item style={{ fontSize: '14px' }} onClick={() => setShowCreateModal(true)}>Tạo nhóm</Dropdown.Item>
                        <Dropdown.Item style={{ fontSize: '14px' }} onClick={() => setShowJoinModal(true)}>Tham gia nhóm</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className={styles.gridContainer}>
                    {groups.map((group, index) => (
                        <div key={index} className={`${styles.groupItem} ${index % 2 === 0  ? styles.group1 : styles.group2}`}>
                            <div onClick={() => handleGroupClick(group.groupid)}>
                                <div className={styles.groupContent}>
                                    <span className={styles.groupName}>{group.groupname}</span>
                                    <div className={styles.groupId}>Group ID: {group.groupid}</div>
                                </div>
                            </div> 
                            <FontAwesomeIcon className={styles.leaveIcon} icon={faEllipsisV} onClick={() => toggleLeaveOption(group)} />
                                {showLeaveOption === group && (
                                    <div ref={leaveOptionRef} className={styles.leaveOption} onClick={() => setShowDeleteConfirmation(true)}>
                                        Rời nhóm
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
                {/* Modal confirm out */}
                <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác rời nhóm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn có chắc chắn muốn rời nhóm này không?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => handleLeaveGroup()}>
                            Xác nhận
                        </Button>
                        <Button variant="primary" onClick={() => setShowDeleteConfirmation(false)}>
                            Hủy
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            {/*Modal tạo nhóm*/}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo Nhóm</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{height: '300px'}}>
                    <Form>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Tên Nhóm</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên nhóm"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </Form.Group>
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
                                            color="red" 
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
                    <Button variant="primary" onClick={handleCreateGroup}>
                        Tạo Nhóm
                    </Button>
                    <Button variant="danger" onClick={() => setShowCreateModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal tham gia nhóm */}
            <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tham Gia Nhóm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formGroupCode">
                            <Form.Label>Mã Nhóm</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập mã nhóm"
                                value={groupCode}
                                onChange={(e) => setGroupCode(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleJoinGroup}>
                        Tham Gia
                    </Button>
                    <Button variant="danger" onClick={() => setShowJoinModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
