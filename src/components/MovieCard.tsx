import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const IMAGE_NOT_FOUND = '/images/no-image.png';

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className='movie-card'>
      <img src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : `${IMAGE_NOT_FOUND}`} alt={movie.title}/>
      
      <div className='mt-4'>
        <h3 className='text-lg font-bold'>{movie.title}</h3>

        <div className='content'>
          <div className='rating'>
            <img src='/star.svg' alt='Star Icon' />
            <p>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className='lang'>{movie.original_language}</p>

          <span>•</span>
          <p className='year'>
            {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;