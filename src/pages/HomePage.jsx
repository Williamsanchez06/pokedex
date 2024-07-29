import React from 'react';
import { Link } from 'react-router-dom';
import { usePokemonList } from '../hooks/usePokemonList';

import pokeballImage from '../assets/bola-pokemon.webp';
import searchIcon from '../assets/search-icon.png';
import almuhadillaIcon from '../assets/almuhadilla-caracter.jfif';
import letraA from '../assets/letra-a.jfif';
import corazonSinRelleno from '../assets/corazon-sin-relleno.png';
import corazon from '../assets/corazon-relleno.jfif';

export const HomePage = () => {
    const {
        loading,
        error,
        pokemons,
        sortOption,
        isSortVisible,
        searchValue,
        favorites,
        isLoading,
        handleSortChange,
        toggleSortVisibility,
        handleSearchChange,
        toggleFavorite
    } = usePokemonList();

    if (loading || isLoading) return <div className="container-loader"><div className="loader"></div></div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container">
            <div className="header">
                <div className="header-top">
                    <img src={pokeballImage} alt="Pokeball" className="logo"/>
                    <span className="title">Pokédex</span>
                    <div className="favorites-container">
                        <div className="favorites-icon-container">
                            <Link to="/favorites">
                                <img src={corazon} alt="Favorites" className="favorites-icon" />
                            </Link>
                            <span className="favorites-count">{favorites.length}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-start">
                    <div className="search-container">
                        <img src={searchIcon} alt="Search" className="search-icon"/>
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            value={sortOption === 'number' ? `#${searchValue}` : searchValue}
                            onChange={handleSearchChange}
                            readOnly={sortOption === 'number' && searchValue === '#'}
                        />
                        <div className="sort-icon-container" onClick={toggleSortVisibility}>
                            <img
                                src={sortOption === 'number' ? almuhadillaIcon : letraA}
                                alt="Sort"
                                className="sort-icon"
                            />
                            <div className={`sort-container ${isSortVisible ? 'active' : ''}`}>
                                <div className="sort-title">Sort by:</div>
                                <div className="sort-option">
                                    <input
                                        type="radio"
                                        id="sortNumber"
                                        name="sort"
                                        value="number"
                                        checked={sortOption === 'number'}
                                        onChange={handleSortChange}
                                    />
                                    <label htmlFor="sortNumber">Number</label>
                                </div>
                                <div className="sort-option">
                                    <input
                                        type="radio"
                                        id="sortName"
                                        name="sort"
                                        value="name"
                                        checked={sortOption === 'name'}
                                        onChange={handleSortChange}
                                    />
                                    <label htmlFor="sortName">Name</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {pokemons.length === 0 ? (
                <div className="no-results">No hay resultados</div>
            ) : (
                <div className="pokemon-grid">
                    {pokemons.map(pokemon => (
                        <div key={pokemon.id} className="pokemon-card">
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
