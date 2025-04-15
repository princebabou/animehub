import { Suspense } from "react";
import Image from "next/image";
import { fetchAnimeById } from "@/app/lib/api";
import LoadingState from "@/app/components/LoadingState";
import AnimeCarousel from "@/app/components/AnimeCarousel";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Genre {
  mal_id: number;
  type: string;
  name: string;
}

interface Studio {
  mal_id: number;
  type: string;
  name: string;
}

async function getAnimeDetails(id: number) {
  try {
    const response = await fetchAnimeById(id);
    return response.data;
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  // Make sure params is resolved before accessing id
  const resolvedParams = params;
  const id = parseInt(resolvedParams.id);
  const anime = await getAnimeDetails(id);

  if (!anime) {
    return {
      title: "Anime Not Found - AnimeHub",
    };
  }

  return {
    title: `${anime.title} - AnimeHub`,
    description:
      anime.synopsis?.substring(0, 160) || "Check out this anime on AnimeHub",
    openGraph: {
      images: [{ url: anime.images.jpg.large_image_url }],
    },
  };
}

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  // Make sure params is resolved before accessing id
  const resolvedParams = params;
  const id = parseInt(resolvedParams.id);
  const anime = await getAnimeDetails(id);

  if (!anime) {
    notFound();
  }

  return (
    <div className="space-y-12">
      {/* Hero section with anime cover */}
      <div className="relative w-full h-[50vh] md:h-[60vh] rounded-xl overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-end gap-6">
            <div className="relative h-48 w-36 md:h-72 md:w-52 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border-4 border-white dark:border-gray-900">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-grow md:pb-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {anime.title}
              </h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <h2 className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-2">
                  {anime.title_english}
                </h2>
              )}

              <div className="flex flex-wrap gap-2 mt-3 mb-4">
                {anime.genres?.map((genre: Genre) => (
                  <Link
                    key={genre.mal_id}
                    href={`/discover?genre=${genre.mal_id}`}
                    className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center mt-2">
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
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 lg:col-span-3 space-y-8">
          {/* Synopsis */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {anime.synopsis || "No synopsis available."}
            </p>
          </section>

          {/* Trailer */}
          {anime.trailer?.embed_url && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Trailer</h2>
              <div className="aspect-video w-full rounded-xl overflow-hidden">
                <iframe
                  src={anime.trailer.embed_url}
                  allowFullScreen
                  title={`${anime.title} trailer`}
                  className="w-full h-full"
                />
              </div>
            </section>
          )}

          {/* Studios */}
          {anime.studios && anime.studios.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Studios</h2>
              <div className="flex flex-wrap gap-2">
                {anime.studios.map((studio: Studio) => (
                  <span
                    key={studio.mal_id}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    {studio.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <dl className="space-y-2">
              {anime.type && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Type</dt>
                  <dd>{anime.type}</dd>
                </div>
              )}
              {anime.episodes && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Episodes</dt>
                  <dd>{anime.episodes}</dd>
                </div>
              )}
              {anime.status && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                  <dd>{anime.status}</dd>
                </div>
              )}
              {anime.aired?.from && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Aired</dt>
                  <dd>
                    {new Date(anime.aired.from).toLocaleDateString()}
                    {anime.aired.to &&
                      ` to ${new Date(anime.aired.to).toLocaleDateString()}`}
                  </dd>
                </div>
              )}
              {anime.duration && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Duration</dt>
                  <dd>{anime.duration}</dd>
                </div>
              )}
              {anime.rating && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Rating</dt>
                  <dd>{anime.rating}</dd>
                </div>
              )}
              {anime.rank && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Rank</dt>
                  <dd>#{anime.rank}</dd>
                </div>
              )}
              {anime.popularity && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Popularity
                  </dt>
                  <dd>#{anime.popularity}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* External links */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">External Links</h3>
            <div className="flex flex-col gap-2">
              <a
                href={`https://myanimelist.net/anime/${anime.mal_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                MyAnimeList
              </a>
              {/* More links can be added here */}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <section className="py-8">
        <Suspense fallback={<LoadingState variant="minimal" />}>
          <AnimeCarousel type="trending" title="You May Also Like" />
        </Suspense>
      </section>
    </div>
  );
}
