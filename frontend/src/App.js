import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Start } from  './pages/Start/Start';
import { Group } from './pages/Group/Group';
import { Home } from './pages/Home/Home';
import { ShoppingList } from  './pages/ShoppingList/ShoppingList';
import { MealPlan } from './pages/MealPlan/MealPlan';
import { Recipes } from  './pages/Recipes/Recipes';
import { FoodStorage } from './pages/FoodStorage/FoodStorage';

import {LoginAdmin} from './pagesAdmin/Login/Login';
import { Manage_group } from './pagesAdmin/Manage_group/group';
import { Manage_item } from './pagesAdmin/Manage_item/item';
import { Manage_recipe } from './pagesAdmin/Manage_recipe/recipe';
import React from 'react';

export const App = () => {
    return (
        <>
             
            <Routes>
                <Route path="/" element={<Start/>}/>
                <Route path="/group" element={<Group/>}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/shoppingList" element={<ShoppingList />}/>
                <Route path="/mealPlan" element={<MealPlan />}/>    
                <Route path="/recipes" element={<Recipes />}/>
                <Route path="/foodStorage" element={<FoodStorage />}/>

                <Route path="/loginAdmin" element={<LoginAdmin />}/>
                <Route path="/manage_item" element={<Manage_item />}/>
                <Route path="/manage_recipe" element={<Manage_recipe />}/>
                <Route path="/manage_group" element={<Manage_group />}/>


            </Routes>
        </>
    );
};