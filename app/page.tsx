import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/HeroSection";
import LoadingState from "./components/LoadingState";
import AnimeCarousel from "./components/AnimeCarousel";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <Suspense fallback={<LoadingState />}>
        <HeroSection />
      </Suspense>

      {/* Categories Section */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative rounded-xl overflow-hidden aspect-video shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-lg md:text-xl font-bold text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Anime */}
      <section className="py-8">
        <Suspense fallback={<LoadingState variant="minimal" />}>
          <AnimeCarousel
            type="trending"
            title="Trending Now"
            viewMoreHref="/top-anime"
          />
        </Suspense>
      </section>

      {/* Current Season Anime */}
      <section className="py-8">
        <Suspense fallback={<LoadingState variant="minimal" />}>
          <AnimeCarousel
            type="current-season"
            title="Current Season"
            viewMoreHref="/seasonal"
          />
        </Suspense>
      </section>

      {/* Upcoming Anime */}
      <section className="py-8">
        <Suspense fallback={<LoadingState variant="minimal" />}>
          <AnimeCarousel
            type="upcoming"
            title="Upcoming Releases"
            viewMoreHref="/seasonal?category=upcoming"
          />
        </Suspense>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose AnimeHub?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the best anime experience with our innovative features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    id: "action",
    name: "Action",
    href: "/discover?genre=1",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
  },
  {
    id: "romance",
    name: "Romance",
    href: "/discover?genre=22",
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    href: "/discover?genre=10",
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
  },
  {
    id: "comedy",
    name: "Comedy",
    href: "/discover?genre=4",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
  },
];

const features = [
  {
    title: "Extensive Library",
    description:
      "Access thousands of anime titles from classics to the latest releases",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    title: "Personalized Recommendations",
    description:
      "Discover new anime based on your preferences and viewing history",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
  {
    title: "Detailed Information",
    description:
      "Get comprehensive details, ratings, and reviews for every anime",
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];
