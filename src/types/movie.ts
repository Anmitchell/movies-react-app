export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  original_language?: string;
}

export interface TrendingMovie {
  $id: string;
  searchTerm?: string;
  count?: number;
  movie_id?: number;
  poster_url?: string;
  title?: string;
} 