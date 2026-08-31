import MovieCard from "../../components/MovieCard/MovieCard";
import type { Movie } from "../../types/movie";

interface HomeViewProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  onFavourite: (movie: Movie) => void | Promise<void>;
}

function HomeView({ movies, loading, error, onFavourite }: HomeViewProps) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {loading && <p className="text-neutral-300 mb-4">Loading...</p>}

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <li key={movie.imdbID}>
            <MovieCard movie={movie} onFavourite={onFavourite} />
          </li>
        ))}
      </ul>
    </main>
  );
}
export default HomeView;
