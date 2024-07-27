import React from 'react';
import { Route, Routes, Navigate} from 'react-router-dom';

import Navigation from "./components/Navigation.jsx";
import { DetailPokemonPage , HomePage } from "./pages";

const AppRouter = () => {
    return <Routes>

        <Route path='/' element={ <Navigation /> }>
            <Route index element={ <HomePage /> } />
            <Route path='pokemon/:id' element={<DetailPokemonPage /> } />
        </Route>

        <Route path='/' element={ <Navigate to='/' /> } />
    </Routes>
};

export default AppRouter;