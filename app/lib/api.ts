import {
  AnimeResponse,
  GenreResponse,
  AnimeType,
  AnimeStatus,
  AnimeSort,
  Season,
} from "./types";

const API_BASE_URL = "https://api.jikan.moe/v4";

// Helper to add delay between API calls (Jikan API has rate limits)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchTopAnime(
  page: number = 1,
  limit: number = 12
): Promise<AnimeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/top/anime?page=${page}&limit=${limit}`
  );
  await delay(1000); // Respect API rate limits
  return response.json();
}

export async function fetchAnimeById(id: number): Promise<{ data: any }> {
  const response = await fetch(`${API_BASE_URL}/anime/${id}`);
  await delay(1000);
  return response.json();
}

export async function fetchSeasonalAnime(
  year: number,
  season: Season,
  page: number = 1,
  limit: number = 12
): Promise<AnimeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/seasons/${year}/${season}?page=${page}&limit=${limit}`
  );
  await delay(1000);
  return response.json();
}

export async function fetchCurrentSeasonAnime(
  page: number = 1,
  limit: number = 12
): Promise<AnimeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/seasons/now?page=${page}&limit=${limit}`
  );
  await delay(1000);
  return response.json();
}

export async function fetchUpcomingAnime(
  page: number = 1,
  limit: number = 12
): Promise<AnimeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/seasons/upcoming?page=${page}&limit=${limit}`
  );
  await delay(1000);
  return response.json();
}

export async function fetchAnimeGenres(): Promise<GenreResponse> {
  const response = await fetch(`${API_BASE_URL}/genres/anime`);
  await delay(1000);
  return response.json();
}

export async function searchAnime(
  query: string,
  type?: AnimeType,
  status?: AnimeStatus,
  sort?: AnimeSort,
  page: number = 1,
  limit: number = 12
): Promise<AnimeResponse> {
  let url = `${API_BASE_URL}/anime?q=${encodeURIComponent(
    query
  )}&page=${page}&limit=${limit}`;

  if (type) url += `&type=${type}`;
  if (status) url += `&status=${status}`;
  if (sort) url += `&sort=${sort}`;

  const response = await fetch(url);
  await delay(1000);
  return response.json();
}

export async function fetchAnimeByGenre(
  genreId: number,
  page: number = 1,
  limit: number = 12
): Promise<AnimeResponse> {
  const response = await fetch(
    `${API_BASE_URL}/anime?genres=${genreId}&page=${page}&limit=${limit}`
  );
  await delay(1000);
  return response.json();
}

export async function fetchRandomAnime(): Promise<{ data: any }> {
  const response = await fetch(`${API_BASE_URL}/random/anime`);
  await delay(1000);
  return response.json();
}
