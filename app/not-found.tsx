import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="mb-8">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse opacity-30 blur-xl" />
          <div className="relative text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            404
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>

      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        The anime you&apos;re looking for may have teleported to another dimension or
        is yet to be discovered.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-full transition-all duration-200"
        >
          Return Home
        </Link>

        <Link
          href="/discover"
          className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white font-semibold rounded-full transition-all duration-200"
        >
          Explore Anime
        </Link>
      </div>

      <div className="mt-16 relative w-full max-w-xs mx-auto opacity-70">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-5xl">
          (╯°□°)╯︵ ┻━┻
        </div>
      </div>
    </div>
  );
}
