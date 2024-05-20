import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components/Layouts/Header/Header';
import { Start } from  './pages/Start/Start';
import { Group } from './pages/Group/Group';
import { Home } from './pages/Home/Home';
import { ShoppingList } from  './pages/ShoppingList/ShoppingList';
import { MealPlan } from './pages/MealPlan/MealPlan';
import { Recipes } from  './pages/Recipes/Recipes';
import { FoodStorage } from './pages/FoodStorage/FoodStorage';
import { Routes, Route } from 'react-router-dom'; 
import React from 'react';

export const App = () => {
    return (
        <>
            <Header/>        
            <Routes>
                <Route path="/" element={<Start/>}/>
                <Route path="/group" element={<Group/>}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/shoppingList" element={<ShoppingList />}/>
                <Route path="/mealPlan" element={<MealPlan />}/>    
                <Route path="/recipes" element={<Recipes />}/>
                <Route path="/foodStorage" element={<FoodStorage />}/>
            </Routes>
        </>
    );
};
