import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar/Sidebar';
import globalstyles from '../../CSSglobal.module.css';
import styles from './Home.module.css';

export const Home = () => {
    const [shoppingList, setShoppingList] = useState([]);
    const [mealPlans, setMealPlans] = useState([]);
    const [expiringItems, setExpiringItems] = useState([]);

    useEffect(() => {
        // Fetch data for shopping list, meal plans, and expiring items
        axios.get('/api/shopping-list')
            .then(response => setShoppingList(response.data))
            .catch(error => console.error(error));

        axios.get('/api/meal-plans')
            .then(response => setMealPlans(response.data))
            .catch(error => console.error(error));

        axios.get('/api/expiring-items')
            .then(response => setExpiringItems(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className={styles['home-container']}>
            <Sidebar />
            <Container fluid className={globalstyles['main-background']}>
                <Row>
                    <Col md={4}>
                        <Card className={styles['card-section']}>
                            <Card.Header>Danh Sách Mua Sắm</Card.Header>
                            <ListGroup variant="flush">
                                {shoppingList.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        {item.name} - {item.quantity}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Card.Footer>
                                <Button variant="primary">Thêm Món Đồ</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className={styles['card-section']}>
                            <Card.Header>Kế Hoạch Bữa Ăn</Card.Header>
                            <ListGroup variant="flush">
                                {mealPlans.map((plan, index) => (
                                    <ListGroup.Item key={index}>
                                        {plan.meal} - {plan.day}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Card.Footer>
                                <Button variant="primary">Lên Kế Hoạch</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className={styles['card-section']}>
                            <Card.Header>Nhắc Nhở Thực Phẩm Sắp Hết Hạn</Card.Header>
                            <ListGroup variant="flush">
                                {expiringItems.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        {item.name} - Hết hạn vào {item.expiryDate}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;    
