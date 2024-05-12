import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Tab, Nav } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';; 
import styles from './Start.module.css'; 

export const Start = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log("Email:", email); 
        console.log("Password:", password);
        navigate('/home');
    };

    const handleSignUp = () => {
        console.log("Email:", email); 
        console.log("Password:", password);
        console.log("confirm Password:", confirmPassword);
        navigate('/home');
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
                                    <Form >
                                        <Form.Group controlId="loginEmail">
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group controlId="loginPassword">
                                            <Form.Label style={{marginTop: '20px'}}>Mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </Form.Group>            
                                        <div style={{ color: 'red' }}>{error && <p>{error}</p>}</div>
                                        <Button type="button" className={styles.btn}  style={{marginTop: '40px'}} onClick={handleLogin}>Đăng nhập</Button>
                                    </Form>
                                </Tab.Pane>
                                <Tab.Pane eventKey="register" style={{ flex: '1', paddingTop: '20px', paddingLeft: '50px', paddingRight: '50px'}}>
                                    <Form >
                                        <Form.Group controlId="signUpEmail">
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                                        </Form.Group>
                                        <Form.Group controlId="signUpPassword">
                                            <Form.Label style={{marginTop: '10px'}}>Mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        </Form.Group>    
                                        <Form.Group controlId="signUpConfirmPassword">
                                            <Form.Label style={{marginTop: '10px'}}>Nhập lại mật khẩu:</Form.Label>
                                            <Form.Control type="confirmPassword" placeholder="Enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                        </Form.Group>         
                                        <div style={{ color: 'red' }}>{error && <p>{error}</p>}</div>
                                        <Button type="button" className={styles.btn} style={{marginTop: '10px'}} onClick={handleSignUp}>Đăng ký</Button>
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
