"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Anime, Genre, AnimeType, AnimeStatus } from "../lib/types";
import { fetchAnimeGenres, searchAnime, fetchAnimeByGenre } from "../lib/api";
import AnimeGrid from "../components/AnimeGrid";
import LoadingState from "../components/LoadingState";

type AnimeSortOption = "score" | "popularity" | "rank" | "favorites";

function DiscoverPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(
    searchParams.get("genre")
      ? parseInt(searchParams.get("genre") as string)
      : null
  );
  const [selectedType, setSelectedType] = useState<AnimeType | "">(
    (searchParams.get("type") as AnimeType) || ""
  );
  const [selectedStatus, setSelectedStatus] = useState<AnimeStatus | "">(
    (searchParams.get("status") as AnimeStatus) || ""
  );
  const [selectedSort, setSelectedSort] = useState<AnimeSortOption>(
    (searchParams.get("sort") as AnimeSortOption) || "score"
  );

  // Load genres on initial render
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await fetchAnimeGenres();
        if (response.data) {
          setGenres(response.data);
        }
      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };

    loadGenres();
  }, []);

  // Fetch anime based on filters
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      try {
        let response;

        if (searchQuery) {
          response = await searchAnime(
            searchQuery,
            selectedType || undefined,
            selectedStatus || undefined,
            selectedSort,
            currentPage
          );
        } else if (selectedGenre) {
          response = await fetchAnimeByGenre(selectedGenre, currentPage);
        } else {
          // Default to top anime if no filters
          response = await searchAnime(
            "",
            selectedType || undefined,
            selectedStatus || undefined,
            selectedSort,
            currentPage
          );
        }

        if (response.data) {
          setAnimeList(response.data);
          setTotalPages(response.pagination.last_visible_page);
        }
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [
    searchQuery,
    selectedGenre,
    selectedType,
    selectedStatus,
    selectedSort,
    currentPage,
  ]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedGenre) params.set("genre", selectedGenre.toString());
    if (selectedType) params.set("type", selectedType);
    if (selectedStatus) params.set("status", selectedStatus);
    if (selectedSort) params.set("sort", selectedSort);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = `/discover?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [
    searchQuery,
    selectedGenre,
    selectedType,
    selectedStatus,
    selectedSort,
    currentPage,
    router,
  ]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre(null);
    setSelectedType("");
    setSelectedStatus("");
    setSelectedSort("score");
    setCurrentPage(1);
  };

  const genreLabel = selectedGenre
    ? genres.find((g) => g.mal_id === selectedGenre)?.name || "Genre"
    : "Genre";

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 sm:p-10 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Discover Anime</h1>

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 border-transparent focus:ring-2 focus:ring-purple-500 shadow-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm"
              >
                Search
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap gap-4">
            {/* Genre filter */}
            <div className="relative">
              <select
                value={selectedGenre?.toString() || ""}
                onChange={(e) =>
                  setSelectedGenre(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="appearance-none w-full md:w-48 py-2 pl-4 pr-10 rounded-lg bg-white dark:bg-gray-800 border-transparent shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.mal_id} value={genre.mal_id}>
                    {genre.name} ({genre.count})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Type filter */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as AnimeType)}
                className="appearance-none w-full md:w-40 py-2 pl-4 pr-10 rounded-lg bg-white dark:bg-gray-800 border-transparent shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                <option value="tv">TV</option>
                <option value="movie">Movie</option>
                <option value="ova">OVA</option>
                <option value="special">Special</option>
                <option value="ona">ONA</option>
                <option value="music">Music</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as AnimeStatus)
                }
                className="appearance-none w-full md:w-40 py-2 pl-4 pr-10 rounded-lg bg-white dark:bg-gray-800 border-transparent shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="airing">Airing</option>
                <option value="complete">Completed</option>
                <option value="upcoming">Upcoming</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Sort filter */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as AnimeSortOption)}
                className="appearance-none w-full md:w-48 py-2 pl-4 pr-10 rounded-lg bg-white dark:bg-gray-800 border-transparent shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="score">Rating (High to Low)</option>
                <option value="popularity">Popularity</option>
                <option value="rank">Rank</option>
                <option value="favorites">Favorites</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Active filters */}
      {(searchQuery || selectedGenre || selectedType || selectedStatus) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-gray-500 dark:text-gray-400">
            Active filters:
          </span>

          {searchQuery && (
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm flex items-center gap-1">
              Search: {searchQuery}
              <button
                onClick={() => setSearchQuery("")}
                className="ml-1 p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          )}

          {selectedGenre && (
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm flex items-center gap-1">
              Genre: {genreLabel}
              <button
                onClick={() => setSelectedGenre(null)}
                className="ml-1 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          )}

          {selectedType && (
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1">
              Type: {selectedType.toUpperCase()}
              <button
                onClick={() => setSelectedType("")}
                className="ml-1 p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          )}

          {selectedStatus && (
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm flex items-center gap-1">
              Status:{" "}
              {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              <button
                onClick={() => setSelectedStatus("")}
                className="ml-1 p-0.5 hover:bg-green-200 dark:hover:bg-green-800 rounded-full"
              >
                <svg
                  className="h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      <div>
        <AnimeGrid
          animeList={animeList}
          isLoading={isLoading}
          title={
            selectedGenre
              ? `${genreLabel} Anime`
              : searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Discover Anime"
          }
          emptyMessage={
            searchQuery
              ? `No results found for "${searchQuery}"`
              : selectedGenre
              ? `No anime found for ${genreLabel}`
              : "No anime found"
          }
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DiscoverPageContent />
    </Suspense>
  );
}
