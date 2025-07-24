# 🎬 Movie Search App

A modern React TypeScript application that helps users discover and search for movies using The Movie Database (TMDB) API. Built with Vite, featuring real-time search, trending movies tracking, and robust error handling.

## ✨ Features

### 🎯 Core Functionality

- **Real-time Movie Search** - Search movies by title with instant results
- **Popular Movies Discovery** - Browse trending and popular movies
- **Search Analytics** - Track search patterns and trending searches
- **Responsive Design** - Modern UI with Tailwind CSS

### 🔧 Technical Features

- **Input Debouncing** - Prevents excessive API calls while typing
- **Conditional Rendering** - Dynamic UI based on loading/error states
- **Network Error Handling** - Comprehensive error management for API failures
- **TypeScript** - Full type safety throughout the application
- **State Management** - Efficient state handling with React hooks

## 🛠️ Technology Stack

| Technology       | Purpose                                |
| ---------------- | -------------------------------------- |
| **React 19**     | Frontend framework                     |
| **TypeScript**   | Type safety and development experience |
| **Vite**         | Build tool and development server      |
| **Tailwind CSS** | Utility-first CSS framework            |
| **TMDB API**     | Movie data and search functionality    |
| **Appwrite**     | Backend database for search analytics  |
| **React-use**    | Custom hooks (useDebounce)             |

## 🎬 API Integration

### The Movie Database (TMDB) API

This app integrates with TMDB API to provide comprehensive movie data and search functionality.

| Endpoint          | Method | Purpose                | Parameters                |
| ----------------- | ------ | ---------------------- | ------------------------- |
| `/discover/movie` | GET    | Fetch popular movies   | `sort_by=popularity.desc` |
| `/search/movie`   | GET    | Search movies by title | `query={searchTerm}`      |

#### API Response Structure

```json
{
  "page": 1,
  "results": [
    {
      "id": 123,
      "title": "Movie Title",
      "poster_path": "/path/to/poster.jpg",
      "overview": "Movie description...",
      "release_date": "2024-01-01",
      "vote_average": 8.5,
      "original_language": "en"
    }
  ],
  "total_pages": 100,
  "total_results": 2000
}
```

#### Authentication

- Uses Bearer token authentication
- API key stored in environment variables
- Secure header configuration

## 🔄 State Management

### Search State

```typescript
const [searchTerm, setSearchTerm] = useState<string>('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
```

### Movie Data State

```typescript
const [movies, setMovies] = useState<Movie[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string>('');
```

### Trending Movies State

```typescript
const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);
const [trendingMoviesLoading, setTrendingMoviesLoading] =
  useState<boolean>(false);
const [trendingMoviesErrorMessage, setTrendingMoviesErrorMessage] =
  useState<string>('');
```

## 🎯 Key Features Implementation

### 1. Input Debouncing

```typescript
useDebounce(
  () => {
    setDebouncedSearchTerm(searchTerm);
  },
  1000,
  [searchTerm]
);
```

- **Purpose**: Prevents excessive API calls while user is typing
- **Delay**: 1 second of inactivity before triggering search
- **Benefit**: Reduces API rate limiting and improves performance

### 2. Conditional Rendering

```typescript
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
```

- **Loading State**: Shows spinner during API calls
- **Error State**: Displays user-friendly error messages
- **Success State**: Renders movie list when data is available

### 3. useEffect with Fetch

```typescript
useEffect(() => {
  fetchMovies(debouncedSearchTerm);
}, [debouncedSearchTerm]);
```

- **Trigger**: Automatically fetches movies when search term changes
- **Dependency**: Reacts to debounced search term updates
- **Cleanup**: Properly handles component unmounting

### 4. Network Error Handling

#### Timeout Management

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);
```

- **Timeout**: 10-second request timeout
- **AbortController**: Cancels hanging requests
- **Memory Leak Prevention**: Clears timeout in finally block

#### Error Classification

```typescript
if (error instanceof TypeError && error.message.includes('fetch')) {
  setErrorMessage('Network error. Please check your internet connection.');
} else if (error instanceof DOMException && error.name === 'AbortError') {
  setErrorMessage('Request timed out. Please try again.');
}
```

- **Network Errors**: Connectivity issues
- **Timeout Errors**: Request cancellation
- **HTTP Errors**: Server response errors (401, 429, 500+)

### 5. Search Analytics with Appwrite

#### Search Tracking

```typescript
export const updateSearchCount = async (searchTerm: string, movie: Movie) => {
  // Check if search term exists in database
  // Increment count or create new entry
};
```

#### Trending Movies

```typescript
export const getTrendingMovies = async () => {
  // Fetch top 5 most searched terms
  // Return trending movie data
};
```

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the app
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

### Option 3: GitHub Pages

```bash
# Build the app
npm run build

# Push to GitHub with GitHub Pages enabled
```

### Option 4: Static Hosting

```bash
# Build the app
npm run build

# Upload dist/ folder to:
# - AWS S3
# - Digital Ocean Spaces
# - Any static hosting service
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TMDB API key
- Appwrite account and project

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_MOVIE_API_KEY=your_tmdb_api_key_here
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd movie-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Search.tsx     # Search input component
│   ├── Spinner.tsx    # Loading spinner
│   └── MovieCard.tsx  # Movie display card
├── types/             # TypeScript type definitions
│   └── movie.ts      # Movie and TrendingMovie interfaces
├── appwrite.ts        # Appwrite database operations
├── App.tsx           # Main application component
└── main.tsx          # Application entry point
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, responsive interface
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Search Feedback**: Real-time search results
- **Trending Section**: Popular search analytics

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality

- **ESLint**: Code linting with custom rules
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **TMDB API** for comprehensive movie data
- **Appwrite** for backend database services
- **React Team** for the amazing framework
- **Vite Team** for the fast build tool

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
