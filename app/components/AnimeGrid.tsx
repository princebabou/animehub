"use client";

import { Anime } from "../lib/types";
import AnimeCard from "./AnimeCard";
import LoadingState from "./LoadingState";
import { useEffect, useState } from "react";

interface AnimeGridProps {
  animeList: Anime[];
  isLoading?: boolean;
  title?: string;
  showViewMore?: boolean;
  viewMoreHref?: string;
  emptyMessage?: string;
}

export default function AnimeGrid({
  animeList,
  isLoading = false,
  title,
  showViewMore = false,
  viewMoreHref = "",
  emptyMessage = "No anime found",
}: AnimeGridProps) {
  const [displayedAnime, setDisplayedAnime] = useState<Anime[]>([]);
  const [isLayoutShifting, setIsLayoutShifting] = useState(true);

  useEffect(() => {
    // Avoid layout shift once data loads
    if (animeList.length > 0) {
      // Small delay for visual smoothness
      const timer = setTimeout(() => {
        setDisplayedAnime(animeList);
        setIsLayoutShifting(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [animeList]);

  if (isLoading) {
    return <LoadingState variant="card" />;
  }

  if (animeList.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">{emptyMessage}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewMore && viewMoreHref && (
            <a
              href={viewMoreHref}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center"
            >
              View All
              <svg
                className="w-4 h-4 ml-1"
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
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLayoutShifting
          ? // Loading grid placeholders
            Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md animate-pulse h-96"
              >
                <div className="h-56 bg-gray-200 dark:bg-gray-800" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-5/6" />
                </div>
              </div>
            ))
          : displayedAnime.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
      </div>
    </section>
  );
}
