import React, { useState, useContext, useEffect } from 'react';
import { Container, Nav, Tab, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';
import { Icon } from '@iconify/react';

export const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoginError('');
    }, []);
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            let response = await axios.post('/admin/login', { email, password }, config);
            if (response && response.data) {
                const { data } = response;
                // const userid = data.userid;
                navigate('/manage_user');
            } else {
                setLoginError('Unexpected response from server');
            }
        } catch (error) {
            setLoginError('Tài khoản hoặc mật khẩu không đúng !');
        }
    };

    return (
        <div className={styles.startBackground}>
            <Container className={styles.mainContainer}>
                <p className={styles.hello}>Chào mừng bạn đến với Gia đình 360</p>
                <div style={{padding: '0 30px'}}>
                    <Tab.Container id="start-tabs" defaultActiveKey="login">
                        
                            <Nav.Item className={styles.navItem}>
                                <Nav.Link eventKey="login" className={styles.navLink}>Đăng nhập</Nav.Link>
                            </Nav.Item>
                      
                            <Tab.Content >
                                <Tab.Pane eventKey="login" style={{marginTop: '20px'}}>
                                    <Form onSubmit={handleLogin} style={{display: 'grid', gap: '30px'}}>
                                        <Form.Group controlId="loginEmail">
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="loginPassword">
                                            <Form.Label>Mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </Form.Group>
                                        {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
                                        <div>
                                            <Button type="submit" className={styles.btn}>Đăng nhập</Button>
                                            {/* <div className={styles.or}>Hoặc</div>
                                            <div className={styles.iconContainer}>
                                                <div className={styles.logoIcon}><Icon icon="ant-design:google-circle-filled" style={{color: '#e11d48'}}/></div>
                                                <div className={styles.logoIcon}><Icon icon="mdi:facebook" style={{color: '#4f46e5'}}/></div>
                                                <div className={styles.logoIcon}><Icon icon="mage:tiktok-circle" style={{color: '#000000'}}/></div>
                                            </div> */}
                                        </div>
                                    </Form>
                                </Tab.Pane>

                            </Tab.Content>

                    </Tab.Container>
                </div>
            </Container>
        </div>
    );
};