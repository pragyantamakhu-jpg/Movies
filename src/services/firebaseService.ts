import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { get, getDatabase, ref, remove, set } from "firebase/database";
import type { Movie } from "../types/movie";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let _database: ReturnType<typeof getDatabase> | null = null;

const getDatabaseSafe = (): ReturnType<typeof getDatabase> => {
  if (_database) return _database;

  const dbUrl = firebaseConfig.databaseURL;
  if (!dbUrl || typeof dbUrl !== "string" || !dbUrl.trim()) {
    throw new Error(
      "Firebase Realtime Database URL is not configured. Set VITE_FIREBASE_DATABASE_URL to a valid https://<YOUR_FIREBASE>.firebaseio.com URL in your environment.",
    );
  }

  _database = getDatabase(app);
  return _database;
};

const FAVOURITES_PATH = "favourites";

const userFavouritesPath = (userId: string): string => {
  if (!userId.trim()) {
    throw new Error("Failed to access favourites: userId is required.");
  }

  return `users/${userId}/${FAVOURITES_PATH}`;
};

const favouritesRef = (userId: string) =>
  ref(getDatabaseSafe(), userFavouritesPath(userId));

const favouriteRef = (userId: string, imdbID: string) =>
  ref(getDatabaseSafe(), `${userFavouritesPath(userId)}/${imdbID}`);

const toReadableError = (action: string, error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(`Failed to ${action}: ${error.message}`);
  }

  return new Error(`Failed to ${action}. Please try again.`);
};

export const addFavourite = async (
  userId: string,
  movie: Movie,
): Promise<void> => {
  if (!movie.imdbID.trim()) {
    throw new Error("Failed to add favourite: movie imdbID is required.");
  }

  try {
    await set(favouriteRef(userId, movie.imdbID), movie);
  } catch (error) {
    throw toReadableError("add favourite movie", error);
  }
};

export const removeFavourite = async (
  userId: string,
  imdbID: string,
): Promise<void> => {
  if (!imdbID.trim()) {
    throw new Error("Failed to remove favourite: imdbID is required.");
  }

  try {
    await remove(favouriteRef(userId, imdbID));
  } catch (error) {
    throw toReadableError("remove favourite movie", error);
  }
};

export const getFavourites = async (userId: string): Promise<Movie[]> => {
  try {
    const snapshot = await get(favouritesRef(userId));

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val() as Record<string, Movie>;
    return Object.values(data);
  } catch (error) {
    throw toReadableError("load favourite movies", error);
  }
};
