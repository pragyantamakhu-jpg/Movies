import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import type { Movie } from "../../types/movie";
import { loadFavourites, deleteFavourite } from "./FavouritesModel";

export const useFavouritesViewModel = () => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadMovies = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const movies = await loadFavourites(user?.uid ?? "");
      setFavourites(movies);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load favourites.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const removeMovie = useCallback(
    async (imdbID: string): Promise<void> => {
      setError(null);

      try {
        await deleteFavourite(user?.uid ?? "", imdbID);
        setFavourites((prev) => prev.filter((m) => m.imdbID !== imdbID));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to remove favourite.";
        setError(message);
        throw new Error(message);
      }
    },
    [user?.uid],
  );

  useEffect(() => {
    void loadMovies();
  }, [loadMovies]);

  return {
    favourites,
    loading,
    error,
    loadMovies,
    removeMovie,
  };
};

export default useFavouritesViewModel;
