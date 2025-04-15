"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Anime } from "../lib/types";

interface AnimeCardProps {
  anime: Anime;
  variant?: "default" | "featured" | "compact";
}

export default function AnimeCard({
  anime,
  variant = "default",
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === "featured") {
    return (
      <div
        className="relative group w-full h-[500px] rounded-xl overflow-hidden shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          className={`object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex items-center space-x-2 mb-2">
            {anime.score && (
              <span className="bg-yellow-500 text-black font-bold px-2 py-1 rounded text-sm">
                ★ {anime.score.toFixed(1)}
              </span>
            )}
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
              {anime.type}
            </span>
            {anime.episodes && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                {anime.episodes} eps
              </span>
            )}
          </div>
          <h2 className="text-white text-2xl font-bold truncate mb-2">
            {anime.title}
          </h2>
          <p className="text-gray-300 line-clamp-3 mb-4">{anime.synopsis}</p>
          <Link
            href={`/anime/${anime.mal_id}`}
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/anime/${anime.mal_id}`}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={anime.images.jpg.image_url}
            alt={anime.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-sm font-medium truncate">{anime.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {anime.score && (
              <span className="text-xs text-yellow-500">
                ★ {anime.score.toFixed(1)}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {anime.type}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="group relative flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {anime.score && (
            <span className="bg-yellow-500 text-black font-bold px-2 py-1 rounded-md text-xs">
              ★ {anime.score.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {anime.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-2 py-0.5 rounded text-xs">
            {anime.type}
          </span>
          {anime.episodes && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-0.5 rounded text-xs">
              {anime.episodes} eps
            </span>
          )}
          {anime.genres?.slice(0, 1).map((genre) => (
            <span
              key={genre.mal_id}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded text-xs"
            >
              {genre.name}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {anime.synopsis}
        </p>
      </div>
    </Link>
  );
}
