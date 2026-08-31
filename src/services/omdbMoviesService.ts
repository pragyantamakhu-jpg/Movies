

// This file handles communication with the OMDb API
// (fetching movies, search results, etc.).

import type { Movie, OmdbSearchResponse } from "../types/movie";

const API_URL = "https://www.omdbapi.com/";
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const encodedQuery = encodeURIComponent(query);
  const url = `${API_URL}?apikey=${API_KEY}&s=${encodedQuery}`;

  console.log("[omdbMoviesService] searchMovies called with query:", query);
  console.log("[omdbMoviesService] API key loaded:", Boolean(API_KEY));

  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    console.error("[omdbMoviesService] fetch failed:", error);
    throw new Error("Failed to reach the OMDb API. Check your network connection.");
  }

  if (!response.ok) {
    console.error("[omdbMoviesService] bad response status:", response.status);
    throw new Error(`OMDb request failed with status ${response.status}`);
  }

  const data: OmdbSearchResponse = await response.json();
  console.log("[omdbMoviesService] raw response:", data);

  if (data.Response === "False") {
    console.warn("[omdbMoviesService] OMDb error:", data.Error);
    throw new Error(data.Error ?? "OMDb returned no results for this search.");
  }

  const results = data.Search ?? [];
  console.log("[omdbMoviesService] results count:", results.length, results);

  return results;
};