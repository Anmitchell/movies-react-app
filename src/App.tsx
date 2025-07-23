import { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import type { Movie, TrendingMovie } from './types/movie';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_MOVIE_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  // search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // movies
  const [movies, setMovies] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // trending movies
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
  const [trendingMoviesErrorMessage, setTrendingMoviesErrorMessage] = useState<string>('');
  const [trendingMoviesLoading, setTrendingMoviesLoading] = useState<boolean>(false);

  // Debounce the search term to prevent too many requests to the API when the user is typing
  // searchTerm state is not updated immediately, but rather after 1 second of no typing
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

  //fetch movies from the API
  const fetchMovies = async (query: string = ''): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      //fetch movies from the API using the query and the API_BASE_URL
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`  // TMDB API endpoint for searching movies
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`; // TMDB API endpoint for discovering movies

      const response = await fetch(endpoint, {
        ...API_OPTIONS,
        signal: controller.signal, // Abort the request if it takes too long, using the AbortController
      });

      //if the response is not ok, throw an error and handle the different types of errors
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API key is invalid or missing');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      //parse the response as json
      const data = await response.json();

      //if the response has results, set the movies and update the search count
      // TMDB API returns results in the data.results array
      if (data.results) {
        setMovies(data.results);
        
        // If the search term is not empty and there are movies that match the search term, update the search count
        if (query && data.results.length > 0) {
          await updateSearchCount(query, data.results[0]);
        }
      } else {
        setErrorMessage('No movies found');
        setMovies(data.results || []);
        await updateSearchCount('', { id: 0, title: 'No Movie' }); // Update the search count with an empty search term and a movie with id 0
      }
    } catch (error) {
      console.error('Error fetching movies:', error);

      // Check for different types of network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrorMessage(
          'Network error. Please check your internet connection.'
        );
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        setErrorMessage('Request timed out. Please try again.');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to fetch movies. Please try again later.');
      }

      //clear movies
      setMovies([]); 
    } finally {
      //clear the timeout and set the loading to false
      // required to prevent memory leaks from the AbortController
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  //fetch trending movies from the database
  const fetchTrendingMovies = async () => {
    try {
      setTrendingMoviesLoading(true);
      setTrendingMoviesErrorMessage('');

      const trendingMovies = await getTrendingMovies();
      setTrendingMovies(trendingMovies);

      setTrendingMoviesLoading(false);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setTrendingMoviesErrorMessage('Failed to fetch trending movies. Please try again later.');
      setTrendingMovies([]);
    }
  };

  //fetch movies when the debounced search term changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className="">Trending Movies</h2>
            {trendingMoviesLoading ? (
              <Spinner />
            ) : trendingMoviesErrorMessage ? (
              <p className="text-red-500">{trendingMoviesErrorMessage}</p>
            ) : (
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                  <li>
                    <p>{movie.title}</p>
                  </li>
                </li>
              ))}
            </ul>
            )}
          </section>
        )}

        {/* Movies */}
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
