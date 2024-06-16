import React, { useState, useEffect } from 'react'; 
import { Container , Row } from 'react-bootstrap'; 
import {Header} from '../../components/Layouts/Header/Header'
import axios from 'axios';
import Sidebar_admin from '../../components/Layouts/Sidebar/Sidebar_admin';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Group.module.css';

export const Manage_group = () => {
    
    //Lấy danh sách thành viên

    
    return (
        <div>
            <Header/>
           <Sidebar_admin/>
           <Container fluid className={globalstyles['main-background']}>
                <div>Thành viên</div>
            </Container>
        </div>
    );
};
