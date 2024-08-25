/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/books/content/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/content/**",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/books/publisher/content/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/publisher/content/**",
      },
    ],
  },
  experimental: {
    // API Routes の設定が必要な場合ここに追加
  },
};

export default nextConfig;
