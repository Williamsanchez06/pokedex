import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_POKEMON_DETAILS } from '../graphql/queries';

const typeColors = {
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
    default: 'gray'
};

export const usePokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, error, data } = useQuery(GET_POKEMON_DETAILS, {
        variables: { id: parseInt(id) }
    });
    const [typeColor, setTypeColor] = useState(typeColors.default);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            document.body.classList.add('loading');
        } else {
            document.body.classList.remove('loading');
        }

        if (data && data.pokemon_v2_pokemon_by_pk) {
            const pokemon = data.pokemon_v2_pokemon_by_pk;
            const type = pokemon.pokemon_v2_pokemontypes?.[0]?.pokemon_v2_type?.name;
            if (type) {
                const color = typeColors[type] || typeColors.default;
                document.body.style.backgroundColor = color;
                setTypeColor(color);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 200);
        }

        return () => {
            document.body.style.backgroundColor = '';
            document.body.classList.remove('loading');
        };

    }, [data, loading]);

    useEffect(() => {
        if (error || (data && !data.pokemon_v2_pokemon_by_pk)) {
            navigate('/');
        }
    }, [error, data, navigate]);

    return { loading, error, data, typeColor, isLoading };
};
