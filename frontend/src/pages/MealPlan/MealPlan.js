import React, { useState, useEffect } from 'react'; 
import { Container , Row } from 'react-bootstrap'; 
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './MealPlan.module.css';

export const MealPlan = () => {

    return (
        <div>
           <Sidebar/>
           <Container fluid className={globalstyles['main-background']}>
                
            </Container>
        </div>
    );
};
