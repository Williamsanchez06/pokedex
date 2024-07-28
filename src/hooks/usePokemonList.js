import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POKEMONS } from '../graphql/queries';

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

export const usePokemonList = () => {
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

    return {
        loading,
        error,
        pokemons: filteredPokemons,
        sortOption,
        isSortVisible,
        searchValue,
        favorites,
        isLoading,
        handleSortChange,
        toggleSortVisibility,
        handleSearchChange,
        toggleFavorite
    };
};
