/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['backendadonis.onrender.com'],
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: 'https://backendadonis.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
