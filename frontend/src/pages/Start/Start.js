import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Tab, Nav } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import styles from './Start.module.css'; 
import { UserIdContext } from '../../components/context/UserIdAndGroupIdContext';

export const Start = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [username, setUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const {setUserId} = useContext(UserIdContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //-------------------------------------------------------
    //---------------------Đăng nhập-------------------------
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json'} };
            let response = await axios.post('/users/login', { email, password }, config);
            if (response && response.data) {
                const { data } = response;
                const userid = data.userid; 
                setUserId(userid);  
                navigate('/group');     
            } else {
                setError('Unexpected response from server');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    //-------------------------------------------------------
    //----------------------Đăng ký--------------------------
    const handleSignUp = async () => {
        if (signupPassword !== signupConfirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            let response = await axios.post('/users/signup', { username, email: signupEmail, password: signupPassword }, config);
            if (response && response.data) {
                const { data } = response;
                const userid = data.userid; 
                setUserId(userid);  
                setError('');
                navigate('/group');
            } else {
                setError('Unexpected response from server');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    return (
        <div className={styles.startBackground}>
            <Container className={styles.mainContainer}>
                <Row style={{opacity: '1'}}>
                    <Col>
                        <div className={styles.hello}>Chào mừng bạn đến với Gia đình 360</div>
                        <Tab.Container id="start-tabs" defaultActiveKey="login">
                            <Nav variant="tabs">
                            <Nav.Item style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <Nav.Link eventKey="login" style={{ fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '0', outline: 'none', boxShadow: 'none', backgroundColor: 'transparent', width: '100%', textAlign: 'center' }}>Đăng nhập</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <Nav.Link eventKey="register" style={{ fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '0', outline: 'none', boxShadow: 'none', backgroundColor: 'transparent', width: '100%', textAlign: 'center' }}>Đăng ký</Nav.Link>
                            </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="login" style={{ flex: '1', paddingTop: '20px', paddingLeft: '50px', paddingRight: '50px'}}>
                                    <Form onSubmit={(event) => {handleLogin(event)}}>
                                        <Form.Group controlId="loginEmail">
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group controlId="loginPassword">
                                            <Form.Label style={{marginTop: '20px'}}>Mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </Form.Group>            
                                        <div style={{ color: 'red' }}>{error && <p>{error}</p>}</div>
                                        <Button type="submit" className={styles.btn}  style={{marginTop: '40px'}} >Đăng nhập</Button>
                                    </Form>
                                </Tab.Pane>
                                <Tab.Pane eventKey="register" style={{ flex: '1', paddingTop: '5px', paddingLeft: '50px', paddingRight: '50px'}}>
                                    <Form >
                                        <Form.Group controlId="signUpEmail">
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" placeholder="Enter your email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group controlId="signUpPassword">
                                            <Form.Label style={{marginTop: '5px'}}>Mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}/>
                                        </Form.Group>    
                                        <Form.Group controlId="signUpConfirmPassword">
                                            <Form.Label style={{marginTop: '5px'}}>Nhập lại mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)}/>
                                        </Form.Group>   
                                        <Form.Group controlId="signUpUsername">
                                            <Form.Label style={{marginTop: '5px'}}>Tên người dùng:</Form.Label>
                                            <Form.Control type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                        </Form.Group>        
                                        <div style={{ color: 'red' }}>{error && <p>{error}</p>}</div>
                                        <Button type="button" className={styles.btn} style={{marginTop: '15px'}} onClick={handleSignUp}>Đăng ký</Button>
                                    </Form>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
