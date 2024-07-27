import React, {useState} from "react";
import { PokemonContext } from "./PokemonContext.jsx";

export const PokemonProvider = ({ children }) => {

    const [favorites, setFavorites] = useState([]);

    const addFavorite = (pokemon) => {
        setFavorites([...favorites, pokemon]);
    };

    const removeFavorite = (pokemonName) => {
        setFavorites(favorites.filter(pokemon => pokemon.name !== pokemonName));
    };

    return (
        <PokemonContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </PokemonContext.Provider>
    );
};