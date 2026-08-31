// Home-specific data and business logic.

import { searchMovies } from "../../services/omdbMoviesService";
import type { Movie } from "../../types/movie";

const SEED_KEYWORDS = [
  "Batman",
  "Avengers",
  "Harry Potter",
  "Star Wars",
  "Spider-Man",
  "Marvel",
  "Disney",
  "Matrix",
  "Lord of the Rings",
  "Fast",
  "Mission Impossible",
  "Pixar",
  "Horror",
  "Comedy",
  "Action",
];

const TARGET_MOVIE_COUNT = 20;
const KEYWORD_BATCH_SIZE = 5;

const shuffle = <T>(items: T[]): T[] => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const dedupeByImdbId = (movies: Movie[]): Movie[] => {
  const seen = new Set<string>();

  return movies.filter((movie) => {
    if (seen.has(movie.imdbID)) {
      return false;
    }

    seen.add(movie.imdbID);
    return true;
  });
};

const fetchMoviesForKeywords = async (keywords: string[]): Promise<Movie[]> => {
  const results = await Promise.all(
    keywords.map(async (keyword) => {
      try {
        return await searchMovies(keyword);
      } catch {
        return [];
      }
    }),
  );

  return results.flat();
};

export const getMovies = async (query: string): Promise<Movie[]> => {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    throw new Error("Search query must be at least 2 characters long.");
  }

  return await searchMovies(trimmedQuery);
};

export const initialMovies = async (): Promise<Movie[]> => {
  const shuffledKeywords = shuffle(SEED_KEYWORDS);
  let collected: Movie[] = [];
  let keywordIndex = 0;

  while (collected.length < TARGET_MOVIE_COUNT && keywordIndex < shuffledKeywords.length) {
    const keywordBatch = shuffledKeywords.slice(keywordIndex, keywordIndex + KEYWORD_BATCH_SIZE);
    keywordIndex += KEYWORD_BATCH_SIZE;

    const batchResults = await fetchMoviesForKeywords(keywordBatch);
    collected = dedupeByImdbId([...collected, ...batchResults]);
  }

  return shuffle(collected).slice(0, TARGET_MOVIE_COUNT);
};
