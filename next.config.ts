/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backendadonis.onrender.com',
        port: '',
        pathname: '/uploads/avatars/**',
      },
    ],
  },
  // Add this to ignore the rooms directory
  ignoreBuildErrors: true,
  pageExtensions: ['tsx', 'ts'],
  exclude: ['app/rooms/**'],
};