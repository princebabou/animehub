"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Anime } from "../lib/types";
import { searchAnime } from "../lib/api";
import AnimeGrid from "../components/AnimeGrid";
import LoadingState from "../components/LoadingState";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!query) {
      router.push("/discover");
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await searchAnime(
          query,
          undefined,
          undefined,
          undefined,
          currentPage,
          24
        );

        if (response.data) {
          setAnimeList(response.data);
          setTotalPages(response.pagination.last_visible_page);
        }
      } catch (error) {
        console.error("Error searching anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage, router]);

  // Update URL when page changes
  useEffect(() => {
    if (!query) return;

    const params = new URLSearchParams(searchParams);
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    } else {
      params.delete("page");
    }

    const newUrl = `/search?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }, [currentPage, query, router, searchParams]);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 sm:p-10 rounded-2xl">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <p className="text-gray-700 dark:text-gray-300">
          Showing results for <span className="font-semibold">"{query}"</span>
        </p>
      </div>

      {/* Results */}
      <div>
        <AnimeGrid
          animeList={animeList}
          isLoading={isLoading}
          title={`Results for "${query}"`}
          emptyMessage={`No results found for "${query}"`}
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
