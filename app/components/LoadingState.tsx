export default function LoadingState({
  variant = "default",
}: {
  variant?: "default" | "card" | "minimal";
}) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md animate-pulse"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-800" />
            <div className="p-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-md w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="relative h-10 w-10">
          <div className="absolute animate-ping h-full w-full rounded-full bg-purple-400 opacity-75"></div>
          <div className="relative rounded-full h-10 w-10 bg-purple-500 flex items-center justify-center">
            <svg
              className="h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Default loading animation
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin">
          <div className="h-full w-full rounded-full border-4 border-t-purple-600 border-r-transparent border-b-indigo-600 border-l-transparent"></div>
        </div>
        <div className="absolute top-2 left-2 right-2 bottom-2 animate-spin animation-delay-150">
          <div className="h-full w-full rounded-full border-4 border-t-transparent border-r-purple-600 border-b-transparent border-l-indigo-600"></div>
        </div>
        <div className="absolute top-4 left-4 right-4 bottom-4 animate-pulse">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-600/30 to-indigo-600/30"></div>
        </div>
      </div>
      <p className="mt-6 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 animate-pulse">
        Loading amazing anime...
      </p>
    </div>
  );
}
