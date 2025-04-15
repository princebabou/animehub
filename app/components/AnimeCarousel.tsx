"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Anime } from "../lib/types";
import AnimeCard from "./AnimeCard";
import LoadingState from "./LoadingState";
import {
  fetchTopAnime,
  fetchCurrentSeasonAnime,
  fetchUpcomingAnime,
} from "../lib/api";

interface AnimeCarouselProps {
  type: "trending" | "current-season" | "upcoming" | "recommended";
  title: string;
  viewMoreHref?: string;
}

export default function AnimeCarousel({
  type,
  title,
  viewMoreHref,
}: AnimeCarouselProps) {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;

        switch (type) {
          case "trending":
            response = await fetchTopAnime(1, 12);
            break;
          case "current-season":
            response = await fetchCurrentSeasonAnime(1, 12);
            break;
          case "upcoming":
            response = await fetchUpcomingAnime(1, 12);
            break;
          case "recommended":
            // For future implementation
            response = await fetchTopAnime(1, 12);
            break;
          default:
            response = await fetchTopAnime(1, 12);
        }

        if (response.data) {
          setAnimeList(response.data);
        }
      } catch (error) {
        console.error(`Error fetching ${type} anime:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount =
        direction === "left"
          ? -current.clientWidth * 0.75
          : current.clientWidth * 0.75;

      current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <LoadingState variant="minimal" />
      </div>
    );
  }

  if (animeList.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5"
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
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5"
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

          {viewMoreHref && (
            <Link
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
            </Link>
          )}
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {animeList.map((anime, index) => (
          <div
            key={`${anime.mal_id}-${index}`}
            className="flex-shrink-0 w-[250px]"
          >
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>

      {/* Mobile scroll indicators */}
      <div className="sm:hidden flex justify-center gap-1 mt-4">
        {Array.from({ length: Math.ceil(animeList.length / 3) }).map((_, i) => (
          <div
            key={`scroll-indicator-${type}-${i}`}
            className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"
          />
        ))}
      </div>
    </div>
  );
}
