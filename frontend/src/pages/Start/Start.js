import React, { useState, useContext, useEffect } from 'react';
import { Container, Nav, Tab, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Start.module.css';
import { UserIdContext } from '../../components/context/UserIdAndGroupIdContext';
import {Header} from '../../components/Layouts/Header/Header'
import { Icon } from '@iconify/react';

export const Start = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [username, setUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const { setUserId } = useContext(UserIdContext);
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoginError('');
        setSignupError('');
    }, []);

    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isPasswordValid = (password) => {
        return password.length >= 6;
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            let response = await axios.post('/users/login', { email, password }, config);
            if (response && response.data) {
                const { data } = response;
                const userid = data.userid;
                setUserId(userid);
                navigate('/group');
            } else {
                setLoginError('Unexpected response from server');
            }
        } catch (error) {
            setLoginError('Tài khoản hoặc mật khẩu không đúng !');
        }
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (!isEmailValid(signupEmail)) {
            setSignupError('Email không hợp lệ !');
            return;
        }
        if (!isPasswordValid(signupPassword)) {
            setSignupError('Mật khẩu phải lớn hơn 6 ký tự !');
            return;
        }
        if (signupPassword !== signupConfirmPassword) {
            setSignupError('Nhập lại mật khẩu không khớp !');
            return;
        }
        if (username.trim() === '') {
            setSignupError('Tên người dùng không thể để trống !');
            return;
        }
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            let response = await axios.post('/users/signup', { username, email: signupEmail, password: signupPassword }, config);
            if (response && response.data) {
                const { data } = response;
                const userid = data.userid;
                setUserId(userid);
                setSignupError('');
                navigate('/group');
            } else {
                setSignupError('Unexpected response from server');
            }
        } catch (error) {
            setSignupError(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    return (
    <React.Fragment>
       
        <div className={styles.startBackground}>
            <Container className={styles.mainContainer}>
                <p className={styles.hello}>Chào mừng bạn đến với Gia đình 360</p>
                <div style={{padding: '0 30px'}}>
                    <Tab.Container id="start-tabs" defaultActiveKey="login">
                        <Nav variant="tabs">
                            <Nav.Item className={styles.navItem}>
                                <Nav.Link eventKey="login" className={styles.navLink}>Đăng nhập</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className={styles.navItem}>
                                <Nav.Link eventKey="register" className={styles.navLink}>Đăng ký</Nav.Link>
                            </Nav.Item>
                        </Nav>
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

                                <Tab.Pane eventKey="register" style={{marginTop: '20px'}}>
                                    <Form onClick={handleSignUp} style={{display: 'grid', gap: '10px'}}>
                                        <Form.Group controlId="signUpUsername">
                                            <Form.Label>Tên người dùng:</Form.Label>
                                            <Form.Control type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="signUpEmail">
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" placeholder="Enter your email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="signUpPassword">
                                            <Form.Label>Mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="signUpConfirmPassword">
                                            <Form.Label>Nhập lại mật khẩu:</Form.Label>
                                            <Form.Control type="password" placeholder="Enter your password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                                        </Form.Group>
                                        {signupError && <div style={{ color: 'red' }}>{signupError}</div>}
                                        <Button type="button" className={styles.btn} style={{marginTop: '20px'}}>
                                            Đăng ký
                                        </Button>
                                    </Form>
                                </Tab.Pane>
                            </Tab.Content>

                    </Tab.Container>
                </div>
            </Container>
        </div>
        </React.Fragment>
    );
    
};
