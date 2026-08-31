import type { Movie } from "../../types/movie";
import {
  addFavourite,
  removeFavourite,
  getFavourites,
} from "../../services/firebaseService";

export const loadFavourites = async (userId: string): Promise<Movie[]> => {
  return getFavourites(userId);
};

export const saveFavourite = async (
  userId: string,
  movie: Movie,
): Promise<void> => {
  return addFavourite(userId, movie);
};

export const deleteFavourite = async (
  userId: string,
  imdbID: string,
): Promise<void> => {
  return removeFavourite(userId, imdbID);
};
