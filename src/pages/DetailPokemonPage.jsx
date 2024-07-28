import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faRulerVertical, faWeightHanging, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { usePokemonDetails } from '../hooks/usePokemonDetails';

const statNames = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'SATK',
    'special-defense': 'SDEF',
    speed: 'SPD'
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const DetailPokemonPage = () => {
    const { loading, error, data, typeColor, isLoading } = usePokemonDetails();

    if (loading || isLoading) return <div className="container-loader"><div className="loader"></div></div>;
    if (error) return <div>Error: {error.message}</div>;

    const pokemon = data.pokemon_v2_pokemon_by_pk;
    if (!pokemon) {
        return <div>Pokemon not found</div>;
    }

    const pokemonTypes = pokemon.pokemon_v2_pokemontypes || [];
    const stats = pokemon.pokemon_v2_pokemonstats;
    const isLeftDisabled = parseInt(pokemon.id) === 1;

    return (
        <div className="pokemon-container">
            <div className="pokemon-header">
                <div className="pokemon-header-navigation">
                    <Link to="/" className="nav-link">
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </Link>
                    <h1 className="pokemon-name">{capitalizeFirstLetter(pokemon.name)}</h1>
                </div>
                <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>

            <div className="pokemon-detail-card">
                <div className="fondo"></div>

                <div className="container-img">
                    <div className="navigation">
                        {isLeftDisabled ?
                            (
                                <FontAwesomeIcon icon={faChevronLeft} size="2x" color="#d3d3d34f"/>
                            ) :
                            (
                                <Link to={`/pokemon/${parseInt(pokemon.id) - 1}`} className="nav-link">
                                    <FontAwesomeIcon icon={faChevronLeft} size="2x" />
                                </Link>
                            )
                        }
                        <Link to={`/pokemon/${parseInt(pokemon.id) + 1}`} className="nav-link">
                            <FontAwesomeIcon icon={faChevronRight} size="2x" />
                        </Link>
                    </div>
                    <img src={pokemon.pokemon_v2_pokemonsprites[0].sprites.front_default} alt={pokemon.name} className="pokemon-image" />
                </div>
                <div className="pokemon-types">
                    {pokemonTypes.map(pokemonType => (
                        <span
                            className="type-badge"
                            style={{ backgroundColor: typeColor }}
                            key={pokemonType.pokemon_v2_type.name}
                        >
                            {capitalizeFirstLetter(pokemonType.pokemon_v2_type.name)}
                        </span>
                    ))}
                </div>

                <h1 className="details-title" style={{ color: typeColor }}>About</h1>

                <div className="pokemon-details">
                    <div className="attribute">
                        <div className="attribute-icon">
                            <FontAwesomeIcon icon={faWeightHanging} size="2x" />
                            <span className="attribute-value">{pokemon.weight / 10} kg</span>
                        </div>
                        <span className="attribute-label">Weight</span>
                    </div>

                    <div className="attribute">
                        <div className="attribute-icon">
                            <FontAwesomeIcon icon={faRulerVertical} size="2x" />
                            <span className="attribute-value">{pokemon.height / 10} m</span>
                        </div>
                        <span className="attribute-label">Height</span>
                    </div>

                    <div className="moves">
                        <div className="moves-title">
                            {pokemon.pokemon_v2_pokemonmoves.slice(0, 2).map(move => (
                                <span key={move.pokemon_v2_move.name}>{move.pokemon_v2_move.name}</span>
                            ))}
                        </div>
                        <span className="moves-label">Moves</span>
                    </div>
                </div>

                <p className="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam amet cum</p>

                <div className="pokemon-stats">
                    <h2 style={{ color: typeColor }}>Base Stats</h2>
                    {stats.map(stat => (
                        <div className="stats-row" key={stat.pokemon_v2_stat.name}>
                            <span className="stat-name" style={{ color: typeColor }}>{statNames[stat.pokemon_v2_stat.name]}</span>
                            <span>{stat.base_stat.toString().padStart(3, '0')}</span>
                            <div className="stat-bar">
                                <div className="stat-fill" style={{ width: `${stat.base_stat}%`, backgroundColor: typeColor }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};