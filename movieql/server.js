import {ApolloServer, gql} from "apollo-server";
import fetch from "node-fetch";

const api_key = 'b4f38c6dc05658822ec6a4fec0d9f6cd';
const genre_map = {12: 'Adventure', 14: 'Fantasy', 16: 'Animation', 18: 'Drama', 27: 'Horror', 28: 'Action', 35: 'Comedy', 36: 'History', 37: 'Western', 53: 'Thriller', 80: 'Crime', 99: 'Documentary', 878: 'Science Fiction', 9648: 'Mystery', 10402: 'Music', 10749: 'Romance', 10751: 'Family', 10752: 'War', 10770: 'TV Movie'};
const typeDefs = gql`
    """
    영화 정보 객체
    """
    type Movie {
        id : ID!
        title : String!
        overview : String!
        genres : [String!]!
        poster : String!
        release_date : String!
        vote_average : Float!
    }

    type Query {
        popularMovies : [Movie!]!
        upcomingMovies : [Movie!]!
        nowPlayingMovies : [Movie!]!
    }
`;

const resolvers = {
    Query : {
        popularMovies(){
            return fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}`)
                .then(r=>r.json())
                .then((json)=>json.results);
        },
        upcomingMovies(){
            return fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}`)
                .then(r=>r.json())
                .then((json)=>json.results);
        },
        nowPlayingMovies(){
            return fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}`)
                .then(r=>r.json())
                .then((json)=>json.results);
        }
    },
    Movie : {
        poster({poster_path}){
            return `https://www.themoviedb.org/t/p/w220_and_h330_face${poster_path}`;
        },
        genres({genre_ids}){
            return genre_ids.map(id=>genre_map[id]);
        }
    }
}
const server = new ApolloServer({typeDefs,resolvers});

server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
})