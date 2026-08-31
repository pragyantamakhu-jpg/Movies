// React state and actions for the Home screen.

import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMovies, initialMovies } from "./HomeModel";
import type { Movie } from "../../types/movie";
import { saveFavourite } from "../Favourites/FavouritesModel";

const useHomeViewModel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadInitialMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await initialMovies();
      setMovies(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading initial movies.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      reloadInitialMovies();
    }
  }, [location.pathname, reloadInitialMovies]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await getMovies(query);
      setMovies(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while searching for movies.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFavourite = useCallback(
    async (movie: Movie): Promise<void> => {
      if (!user) {
        navigate("/favourites");
        return;
      }

      setError(null);

      try {
        await saveFavourite(user.uid, movie);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while saving the favourite movie.",
        );
      }
    },
    [navigate, user],
  );

  return {
    query,
    setQuery,
    movies,
    loading,
    error,
    handleSearch,
    reloadInitialMovies,
    handleFavourite,
  };
};

export default useHomeViewModel;
