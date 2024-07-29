import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Navigation from "./components/Navigation.jsx";
import { DetailPokemonPage, HomePage, FavoritesPage } from "./pages";

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigation />}>
                <Route index element={<HomePage />} />
                <Route path='pokemon/:id' element={ <DetailPokemonPage /> } />
                <Route path='favorites' element={ <FavoritesPage /> } />
            </Route>

            <Route path='*' element={<Navigate to='/' />} />
        </Routes>
    );
};

export default AppRouter;