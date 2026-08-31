import React from "react";
import MovieCard from "../../components/MovieCard/MovieCard";
import useFavouritesViewModel from "./useFavouritesViewModel";

const FavouritesView: React.FC = () => {
  const { favourites, loading, error, removeMovie } = useFavouritesViewModel();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Favourites</h1>

      {loading && <div className="text-neutral-400">Loading favourites…</div>}

      {error && <div className="text-red-400">Error: {error}</div>}

      {!loading && !error && favourites.length === 0 && (
        <div className="text-neutral-400">
          You have no favourite movies yet.
        </div>
      )}

      {!loading && favourites.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {favourites.map((movie) => (
            <div key={movie.imdbID} className="flex flex-col">
              <MovieCard movie={movie} />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors"
                  onClick={async () => {
                    try {
                      await removeMovie(movie.imdbID);
                    } catch {
                      // removeMovie already sets error in the view model; swallow here
                    }
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default FavouritesView;
