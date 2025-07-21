import React from 'react';
import type { Movie } from '../types/movie';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const IMAGE_NOT_FOUND = '/images/no-image.png';

const MovieCard = ({ movie: { title, poster_path, vote_average, original_language, release_date } }: { movie: Movie }) => {
  return (
    <div className='movie-card'>
      <img src={poster_path ? `${IMAGE_BASE_URL}${poster_path}` : `${IMAGE_NOT_FOUND}`} alt={title}/>
      
      <div className='mt-4'>
        <h3 className='text-lg font-bold'>{title}</h3>

        <div className='content'>
          <div className='rating'>
            <img src='/star.svg' alt='Star Icon' />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>

          <span>•</span>
          <p className='lang'>{original_language}</p>

          <span>•</span>
          <p className='year'>
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;