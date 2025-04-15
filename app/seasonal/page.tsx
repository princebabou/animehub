"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Anime, Season } from "../lib/types";
import {
  fetchSeasonalAnime,
  fetchCurrentSeasonAnime,
  fetchUpcomingAnime,
} from "../lib/api";
import AnimeGrid from "../components/AnimeGrid";
import LoadingState from "../components/LoadingState";

export default function SeasonalPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Get current date for default values
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Convert month to season
  const getDefaultSeason = (): Season => {
    if (currentMonth >= 0 && currentMonth <= 2) return "winter";
    if (currentMonth >= 3 && currentMonth <= 5) return "spring";
    if (currentMonth >= 6 && currentMonth <= 8) return "summer";
    return "fall";
  };

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "current"
  );
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get("year")
      ? parseInt(searchParams.get("year") as string)
      : currentYear
  );
  const [selectedSeason, setSelectedSeason] = useState<Season>(
    (searchParams.get("season") as Season) || getDefaultSeason()
  );

  // Fetch anime based on filters
  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);

      try {
        let response;

        if (selectedCategory === "current") {
          response = await fetchCurrentSeasonAnime(currentPage, 24);
        } else if (selectedCategory === "upcoming") {
          response = await fetchUpcomingAnime(currentPage, 24);
        } else {
          // Past season
          response = await fetchSeasonalAnime(
            selectedYear,
            selectedSeason,
            currentPage,
            24
          );
        }

        if (response.data) {
          setAnimeList(response.data);
          setTotalPages(response.pagination.last_visible_page);
        }
      } catch (error) {
        console.error("Error fetching seasonal anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [selectedCategory, selectedYear, selectedSeason, currentPage]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    params.set("category", selectedCategory);

    if (selectedCategory === "past") {
      params.set("year", selectedYear.toString());
      params.set("season", selectedSeason);
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    }

    const newUrl = `/seasonal?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [selectedCategory, selectedYear, selectedSeason, currentPage, router]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleSeasonChange = (season: Season) => {
    setSelectedSeason(season);
    setCurrentPage(1);
  };

  // Title generation
  const getPageTitle = () => {
    if (selectedCategory === "current") return "Current Season Anime";
    if (selectedCategory === "upcoming") return "Upcoming Anime";
    return `${
      selectedSeason.charAt(0).toUpperCase() + selectedSeason.slice(1)
    } ${selectedYear} Anime`;
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 sm:p-10 rounded-2xl">
        <h1 className="text-3xl font-bold mb-6">Seasonal Anime</h1>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "current"
                ? "bg-purple-600 text-white"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCategoryChange("current")}
          >
            Current Season
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "upcoming"
                ? "bg-purple-600 text-white"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCategoryChange("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "past"
                ? "bg-purple-600 text-white"
                : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCategoryChange("past")}
          >
            Past Seasons
          </button>
        </div>

        {/* Past seasons filters */}
        {selectedCategory === "past" && (
          <div className="flex flex-wrap gap-4">
            {/* Year selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="appearance-none w-full md:w-36 py-2 pl-4 pr-10 rounded-lg bg-white dark:bg-gray-800 border-transparent shadow-sm focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 25 }, (_, i) => currentYear - i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
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

            {/* Season selector */}
            <div className="flex flex-wrap gap-2">
              {(["winter", "spring", "summer", "fall"] as Season[]).map(
                (season) => (
                  <button
                    key={season}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSeason === season
                        ? "bg-indigo-600 text-white"
                        : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleSeasonChange(season)}
                  >
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {isLoading ? (
          <LoadingState />
        ) : (
          <AnimeGrid
            animeList={animeList}
            isLoading={isLoading}
            title={getPageTitle()}
            emptyMessage={`No anime found for ${getPageTitle()}`}
          />
        )}
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
