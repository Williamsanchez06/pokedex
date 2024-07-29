import React from 'react';
import { Link } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';
import corazonSinRelleno from '../assets/corazon-sin-relleno.png';
import corazon from '../assets/corazon-relleno.jfif';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const FavoritesPage = () => {

    const {
        favorites,
        pokemons,
        toggleFavorite,
        isLoading,
        loading,
        error} = usePokemonList();

    const favoritePokemons = pokemons.filter(pokemon => favorites.includes(pokemon.id));

    if (loading || isLoading) return <div className="container-loader"><div className="loader"></div></div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <div className="pokemon-header header-favorites">
                <div className="pokemon-header-navigation">
                    <Link to="/" className="nav-link">
                        <FontAwesomeIcon icon={faArrowLeft} size="2x"/>
                    </Link>
                    <h1 className="pokemon-name">Favoritos</h1>
                </div>
            </div>
            {favoritePokemons.length === 0 ? (
                <div className="no-results">No hay favoritos</div>
            ) : (
                <div className="pokemon-favorites-grid">
                    {favoritePokemons.map(pokemon => (
                        <div key={pokemon.id} className="pokemon-favorites-card">
                            <div className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</div>
                            <Link to={`/pokemon/${pokemon.id}`}>
                            <img
                                    src={pokemon.pokemon_v2_pokemonsprites[0].sprites.front_default}
                                    alt={pokemon.name}
                                />
                                <h2>{pokemon.name}</h2>
                            </Link>
                            <button className="favorite-button" onClick={() => toggleFavorite(pokemon)}>
                                <img src={favorites.includes(pokemon.id) ? corazon : corazonSinRelleno} alt="Favorite" className="heart-icon" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
