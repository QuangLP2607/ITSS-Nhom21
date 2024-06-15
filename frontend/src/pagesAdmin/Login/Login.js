import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

export const LoginAdmin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('student'); 
    const [passwordVisible, setPasswordVisible] = useState(false); 

    const handleSelect = (eventKey) => {
        setRole(eventKey); 
    };

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            let response;
            if (role === 'admin') {
                response = await axios.post('/admin/login', { email, password }, config);
            } else if( role === 'student') {
                response = await axios.post('/student/login', { email, password }, config);
            } else {
                response = await axios.post('/lecturer/login', { email, password }, config);
            }
            
            if (response && response.data) {
                const { data } = response;
                localStorage.setItem('auth', data.success);
                localStorage.setItem('id', data.id);
                localStorage.setItem('role', role);
                if (role === 'admin') {
                    navigate('/student');
                } else if(role === 'student'){
                    navigate('/home');
                }else{
                    navigate('/profile');
                }

            } else {
                setError('Unexpected response from server');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    useEffect(() => {
        if (localStorage.getItem('auth')) {
            console.log('Already logged in');
            const storedRole = localStorage.getItem('role');
            if (storedRole === 'admin') {
                navigate('/student');
            } else if (storedRole === 'student') {
                navigate('/home');
            } else {
                navigate('/profile');
            }
        }
    }, [navigate]);

    return (
        <div className={styles.startBackground}>
            <Form onSubmit={(event) => {handleLogin(event)}} className={styles.loginContainer} >
                <h2 style={{ textAlign: 'center' }}>Đăng nhập</h2>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group controlId="formBasicPassword" style={{ marginTop: '15px', position: 'relative' }} >
                    <Form.Label>Password:</Form.Label>
                    <div className={styles.passwordInputGroup}>
                        <Form.Control type={passwordVisible ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} onClick={handleTogglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '73%', transform: 'translateY(-50%)', cursor: 'pointer' }}/>
                    </div>
                </Form.Group>            
                <div style={{ position: 'fixed', textAlign: 'center', color: 'red' }}>{error && <p>Tài khoản hoặc mật khẩu không chính xác!</p>}</div>
                <Button type="submit" className={styles.btnLogin} variant="primary" >Đăng nhập</Button>
            </Form>
        </div>
    );
};