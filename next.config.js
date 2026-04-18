/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.myanimelist.net", "myanimelist.net"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "myanimelist.net",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
