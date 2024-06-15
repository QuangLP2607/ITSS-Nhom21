import React, { useState, useEffect } from 'react'; 
import { Container , Row } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Home.module.css';

export const Home = () => {
    
    //Lấy danh sách thành viên

    
    return (
        <div>
           <Sidebar/>
           <Container fluid className={globalstyles['main-background']}>
                <div>Thành viên</div>
            </Container>
        </div>
    );
};
