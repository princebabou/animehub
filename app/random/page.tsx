"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchRandomAnime } from "../lib/api";
import LoadingState from "../components/LoadingState";

export default function RandomAnimePage() {
  const [anime, setAnime] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animationClass, setAnimationClass] = useState("");

  const fetchNewRandomAnime = async () => {
    setIsLoading(true);
    setAnimationClass("animate-fade-out");

    // Short delay for animation
    setTimeout(async () => {
      try {
        const response = await fetchRandomAnime();
        setAnime(response.data);
      } catch (error) {
        console.error("Error fetching random anime:", error);
      } finally {
        setIsLoading(false);
        setAnimationClass("animate-fade-in-up");
      }
    }, 300);
  };

  useEffect(() => {
    fetchNewRandomAnime();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">Random Anime Discovery</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
          Explore new shows you might never have discovered otherwise!
        </p>
        <button
          onClick={fetchNewRandomAnime}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-full transition-all duration-200 shadow-lg flex items-center mx-auto"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Finding new anime...
            </>
          ) : (
            <>
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Another
            </>
          )}
        </button>
      </div>

      {isLoading && !anime ? (
        <div className="py-20">
          <LoadingState />
        </div>
      ) : anime ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${animationClass}`}
        >
          {/* Anime image */}
          <div className="md:col-span-1">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-lg border-4 border-white dark:border-gray-800">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href={`/anime/${anime.mal_id}`}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View Details
              </Link>

              {anime.trailer?.youtube_id && (
                <a
                  href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-xl transition-all duration-200 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Watch Trailer
                </a>
              )}

              <a
                href={`https://myanimelist.net/anime/${anime.mal_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-200 font-semibold rounded-xl transition-all duration-200 shadow-md border border-blue-200 dark:border-blue-800 flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                MyAnimeList
              </a>
            </div>
          </div>

          {/* Anime info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{anime.title}</h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <h2 className="text-xl text-gray-500 dark:text-gray-400 mb-2">
                  {anime.title_english}
                </h2>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {anime.genres?.map((genre: any) => (
                  <Link
                    key={genre.mal_id}
                    href={`/discover?genre=${genre.mal_id}`}
                    className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center mt-4">
                {anime.score && (
                  <div className="flex items-center">
                    <div className="bg-yellow-500 text-black font-bold rounded-lg px-3 py-1 flex items-center">
                      <svg
                        className="w-5 h-5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span>{anime.score.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                      ({anime.scored_by.toLocaleString()} votes)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <span className="px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {anime.type}
                  </span>
                  {anime.episodes && (
                    <span className="px-3 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                      {anime.episodes} Episodes
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    {anime.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-3">Information</h3>
                <dl className="space-y-2">
                  {anime.aired?.from && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">
                        Aired
                      </dt>
                      <dd>
                        {new Date(anime.aired.from).toLocaleDateString()}
                        {anime.aired.to &&
                          ` to ${new Date(
                            anime.aired.to
                          ).toLocaleDateString()}`}
                      </dd>
                    </div>
                  )}
                  {anime.duration && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">
                        Duration
                      </dt>
                      <dd>{anime.duration}</dd>
                    </div>
                  )}
                  {anime.rating && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500 dark:text-gray-400">
                        Rating
                      </dt>
                      <dd>{anime.rating}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {anime.studios && anime.studios.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5">
                  <h3 className="text-lg font-semibold mb-3">Studios</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.studios.map((studio: any) => (
                      <span
                        key={studio.mal_id}
                        className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700"
                      >
                        {studio.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Failed to load random anime. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
