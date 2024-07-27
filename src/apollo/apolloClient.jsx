import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createHttpLink } from '@apollo/client/link/http';

// Enlace HTTP a tu API de Pokémon
const httpLink = createHttpLink({
    uri: 'https://beta.pokeapi.co/graphql/v1beta', // URL de la API de Pokémon con graphql
});

// Configuración del cliente Apollo
export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});