import { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import type { Movie } from './types/movie';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  // Debounce the search term to prevent too many requests to the API when the user is typing
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

  const fetchMovies = async (query: string = ''): Promise<void> => {
    setLoading(true);
    setErrorMessage('');

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      //fetch movies from the API using the query and the API_BASE_URL
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, {
        ...API_OPTIONS,
        signal: controller.signal,
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
      if (data.results) {
        setMovies(data.results);
        updateSearchCount(); // ← Temporarily added here for testing
      } else {
        setErrorMessage('No movies found');
        setMovies([]);
        updateSearchCount();
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
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  //fetch movies when the debounced search term changes
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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
