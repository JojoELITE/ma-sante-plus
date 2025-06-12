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
      {
        protocol: 'http',
        hostname: '192.168.1.66',
        port: '3333',
        pathname: '/uploads/avatars/**',
      },
    ],
  },
  // Add this to ignore the rooms directory
  ignoreBuildErrors: true,
  pageExtensions: ['tsx', 'ts'],
  exclude: ['app/rooms/**'],
};