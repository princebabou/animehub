"use client";

import { useEffect, useState } from "react";
import { Anime } from "../lib/types";
import Image from "next/image";
import Link from "next/link";
import { fetchTopAnime } from "../lib/api";
import LoadingState from "./LoadingState";

export default function HeroSection() {
  const [featuredAnime, setFeaturedAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedAnime = async () => {
      try {
        const response = await fetchTopAnime(1, 5);
        if (response && response.data && response.data.length > 0) {
          // Randomly select one of the top 5 anime to feature
          const randomIndex = Math.floor(
            Math.random() * Math.min(5, response.data.length)
          );
          setFeaturedAnime(response.data[randomIndex]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading featured anime:", error);
        setIsLoading(false);
      }
    };

    loadFeaturedAnime();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl">
        <LoadingState />
      </div>
    );
  }

  if (!featuredAnime) {
    return null;
  }

  return (
    <div className="relative w-full h-[80vh] rounded-xl overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0">
        <Image
          src={featuredAnime.images.jpg.large_image_url}
          alt={featuredAnime.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 max-w-4xl">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            {featuredAnime.title}
          </h1>

          <div className="flex flex-wrap gap-3 mb-6">
            {featuredAnime.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.mal_id}
                className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full"
              >
                {genre.name}
              </span>
            ))}

            {featuredAnime.score && (
              <span className="px-3 py-1 bg-yellow-500 text-black font-semibold text-sm rounded-full flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {featuredAnime.score.toFixed(1)}
              </span>
            )}

            <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
              {featuredAnime.type}
            </span>

            {featuredAnime.episodes && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                {featuredAnime.episodes} Episodes
              </span>
            )}
          </div>

          <p className="text-white/80 text-base sm:text-lg mb-8 line-clamp-3 sm:line-clamp-none">
            {featuredAnime.synopsis}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/anime/${featuredAnime.mal_id}`}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              View Details
            </Link>

            {featuredAnime.trailer?.youtube_id && (
              <a
                href={`https://www.youtube.com/watch?v=${featuredAnime.trailer.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-200 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute bottom-6 right-12 hidden md:block">
        <div className="animate-float bg-white/10 backdrop-blur-md p-4 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse opacity-75" />
            </div>
            <div>
              <div className="text-white font-semibold">AnimeHub</div>
              <div className="text-white/70 text-xs">
                Discover amazing anime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
