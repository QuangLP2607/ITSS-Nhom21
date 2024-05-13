import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from './components/Layouts/Header/Header';
import { Start } from  './pages/Start/Start';
import { Home } from './pages/Home/Home';
import { Group } from './pages/Group/Group';
import { MealPlan } from './pages/MealPlan/MealPlan';
import { ShoppingList } from  './pages/ShoppingList/ShoppingList';
import { Recipes } from  './pages/Recipes/Recipes';
import {FoodStorage} from './pages/FoodStorage/FoodStorage';

import React, { useState } from 'react';

export const App = () => {
    return (
        <HashRouter>
            <Header/>        
            <Routes>
                <Route path="/" element={<Start/>}/>
                <Route path="/group" element={<Group/>}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/mealPlan" element={<MealPlan />}/>
                <Route path="/shoppingList" element={<ShoppingList />}/>
                <Route path="/recipes" element={<Recipes />}/>
                <Route path="/foodStorage" element={<FoodStorage />}/>
            </Routes>
        </HashRouter>
    );
};
