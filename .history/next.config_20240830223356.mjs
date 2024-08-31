/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/publisher/content/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/publisher/content/**',
      },
      // 他に実際に利用する画像ホスティングドメインがあれば追加する
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/path/to/images/**',
      },
    ],
  },
};

export default nextConfig;
