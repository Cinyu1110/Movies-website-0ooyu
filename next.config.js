/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'media.themoviedb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img2.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img3.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img9.doubanio.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
