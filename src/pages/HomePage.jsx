import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import pokeballImage from '../assets/bola-pokemon.webp';
import searchIcon from '../assets/search-icon.png';
import almuhadillaIcon from '../assets/almuhadilla-caracter.jfif';
import letraA from '../assets/letra-a.jfif';
import corazonSinRelleno from '../assets/corazon-sin-relleno.png';
import corazon from '../assets/corazon-relleno.jfif';

const GET_POKEMONS = gql`
  query GetPokemons($limit: Int, $offset: Int) {
    pokemon_v2_pokemon(limit: $limit, offset: $offset) {
      id
      name
      pokemon_v2_pokemonsprites {
        sprites
      }
    }
  }
`;

export const HomePage = () => {
    const { loading, error, data } = useQuery(GET_POKEMONS, {
        variables: { limit: 151, offset: 0 }
    });
    const [pokemons, setPokemons] = useState([]);
    const [sortOption, setSortOption] = useState('name');
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            document.body.classList.add('loading');
        } else {
            document.body.classList.remove('loading');
        }

        if (data) {
            setPokemons(sortPokemons(data.pokemon_v2_pokemon, 'name'));
            setTimeout(() => {
                setIsLoading(false);
            }, 200);
        }

        // Cleanup body class on component unmount
        return () => {
            document.body.classList.remove('loading');
        };
    }, [data, loading]);

    useEffect(() => {
        setPokemons(prevPokemons => sortPokemons(prevPokemons, sortOption));
    }, [sortOption]);

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(savedFavorites);
    }, []);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        setSearchValue('');
    };

    const toggleSortVisibility = () => {
        setIsSortVisible(!isSortVisible);
    };

    const handleSearchChange = (e) => {
        let value = e.target.value;
        if (sortOption === 'number') {
            value = value.replace(/[^0-9]/g, ''); // Allow only numbers
        } else {
            value = value.replace(/[^a-zA-Z]/g, ''); // Allow only letters
        }
        setSearchValue(value);
    };

    const toggleFavorite = (pokemon) => {
        setFavorites((prevFavorites) => {
            let updatedFavorites;
            if (prevFavorites.includes(pokemon.id)) {
                updatedFavorites = prevFavorites.filter(fav => fav !== pokemon.id);
            } else {
                updatedFavorites = [...prevFavorites, pokemon.id];
            }
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    const filteredPokemons = filterPokemons(pokemons, searchValue, sortOption);

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
                            <img src={corazon} alt="Favorites" className="favorites-icon" />
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

            <div className="pokemon-grid">
                {filteredPokemons.map(pokemon => (
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
        </div>
    );
};

const sortPokemons = (pokemons, sortOption) => {
    if (sortOption === 'number') {
        return [...pokemons].sort((a, b) => a.id - b.id);
    } else {
        return [...pokemons].sort((a, b) => a.name.localeCompare(b.name));
    }
};

const filterPokemons = (pokemons, searchValue, sortOption) => {
    if (sortOption === 'number') {
        return pokemons.filter(pokemon => pokemon.id.toString().padStart(3, '0').includes(searchValue));
    } else {
        return pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue.toLowerCase()));
    }
};
