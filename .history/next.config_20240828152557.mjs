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
      {
        protocol: "http",
        hostname: "example.com", // 追加
        pathname: "/image.jpg",   // 追加
      },
      {
        protocol: "https",
        hostname: "example.com", // 追加
        pathname: "/image.jpg",   // 追加
      },
    ],
  },
};

export default nextConfig;
