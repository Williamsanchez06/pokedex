    import React, { useEffect, useState } from 'react';
    import { useParams, Link } from 'react-router-dom';
    import { useQuery, gql } from '@apollo/client';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faChevronLeft, faChevronRight, faRulerVertical, faWeightHanging , faArrowLeft } from '@fortawesome/free-solid-svg-icons';

    const GET_POKEMON_DETAILS = gql`
      query GetPokemonDetails($id: Int!) {
        pokemon_v2_pokemon_by_pk(id: $id) {
          id
          name
          weight
          height
          base_experience
          pokemon_v2_pokemonstats {
            base_stat
            pokemon_v2_stat {
              name
            }
          }
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
          pokemon_v2_pokemonsprites {
            sprites
          }
          pokemon_v2_pokemonmoves {
            pokemon_v2_move {
              name
            }
          }
        }
      }
    `;

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
        const { id } = useParams();
        const { loading, error, data } = useQuery(GET_POKEMON_DETAILS, {
            variables: { id: parseInt(id) }
        });
        const [typeColor, setTypeColor] = useState(typeColors.default);

        useEffect(() => {
            if (data) {
                const type = data.pokemon_v2_pokemon_by_pk.pokemon_v2_pokemontypes[0].pokemon_v2_type.name;
                const color = typeColors[type] || typeColors.default;
                document.body.style.backgroundColor = color;
                setTypeColor(color);
            }

            // Cleanup body style on component unmount
            return () => {
                document.body.style.backgroundColor = '';
            };
        }, [data]);

        if (loading) return console.log('loading');
        if (error) return console.log(error.message);

        const pokemon = data.pokemon_v2_pokemon_by_pk;
        const pokemonTypes = pokemon.pokemon_v2_pokemontypes || [];
        const stats = pokemon.pokemon_v2_pokemonstats;

        return (
            <div className="pokemon-container">

                <div className="pokemon-header">
                    <div className="pokemon-header-navigation">
                        <Link to="/" className="nav-link">
                            <FontAwesomeIcon icon={faArrowLeft} size="2x"/>
                        </Link>
                        <h1 className="pokemon-name">{capitalizeFirstLetter(pokemon.name)}</h1>
                    </div>
                    <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
                </div>

                <div className="pokemon-detail-card">

                    <div className="container-img">
                        <div className="navigation">
                            <Link to={`/pokemon/${parseInt(id) - 1}`} className="nav-link">
                                <FontAwesomeIcon icon={faChevronLeft} size="2x"/>
                            </Link>
                            <Link to={`/pokemon/${parseInt(id) + 1}`} className="nav-link">
                                <FontAwesomeIcon icon={faChevronRight} size="2x"/>
                            </Link>
                        </div>
                        <img src={pokemon.pokemon_v2_pokemonsprites[0].sprites.front_default} alt={pokemon.name}
                             className="pokemon-image"/>
                    </div>
                    <div className="pokemon-types">

                        {pokemonTypes.map(pokemonType => (
                            <span
                                className="type-badge"
                                    style={{ backgroundColor: typeColors[pokemonType.pokemon_v2_type.name] }}
                                key={pokemonType.pokemon_v2_type.name}
                            >
                                {capitalizeFirstLetter(pokemonType.pokemon_v2_type.name)}
                            </span>
                        ))}

                    </div>

                    <h1 className="details-title" style={{color: typeColor}}>About</h1>

                    <div className="pokemon-details">

                        <div className="attribute">
                            <div className="attribute-icon">
                                <FontAwesomeIcon icon={faWeightHanging} size="2x"/>
                                <span className="attribute-value">{pokemon.weight / 10} kg</span>
                            </div>
                            <span className="attribute-label">Weight</span>
                        </div>

                        <div className="attribute">
                            <div className="attribute-icon">
                                <FontAwesomeIcon icon={faRulerVertical} size="2x"/>
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

                    <p className="description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam amet
                        cum</p>

                    <div className="pokemon-stats">
                        <h2 style={{color: typeColor}}>Base Stats</h2>
                        {stats.map(stat => (
                            <div className="stats-row" key={stat.pokemon_v2_stat.name}>
                                        <span className="stat-name"
                                              style={{color: typeColor}}>{statNames[stat.pokemon_v2_stat.name]}</span>
                                <span>{stat.base_stat.toString().padStart(3, '0')}</span>
                                <div className="stat-bar">
                                    <div className="stat-fill"
                                         style={{width: `${stat.base_stat}%`, backgroundColor: typeColor}}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        );
    };
