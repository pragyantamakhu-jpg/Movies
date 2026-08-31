import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
  onFavourite?: (movie: Movie) => void | Promise<void>;
}

function MovieCard({ movie, onFavourite }: MovieCardProps) {
  return (
    <article className="rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden">
      {movie.Poster && movie.Poster !== "N/A" ? (
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-72 object-cover"
        />
      ) : (
        <div className="w-full h-72 flex items-center justify-center bg-neutral-800 text-neutral-500 text-sm">
          No poster available
        </div>
      )}
      <div className="p-4">
        <h2 className="text-white font-medium">{movie.Title}</h2>
        <p className="text-neutral-400 text-sm mt-1">{movie.Year}</p>
        <p className="text-neutral-500 text-sm capitalize mt-1">{movie.Type}</p>
        <button
          type="button"
          className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
          onClick={() => {
            if (onFavourite) void onFavourite(movie);
          }}
        >
          Favourite
        </button>
      </div>
    </article>
  );
}

export default MovieCard;
