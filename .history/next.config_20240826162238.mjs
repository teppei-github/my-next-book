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
  webpack: (config) => {
    // クライアントサイドのコードで fs モジュールを使わないように設定
    config.resolve.fallback = { fs: false };
    return config;
  },
};

export default nextConfig;
