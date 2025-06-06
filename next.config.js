module.exports = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: 'http://192.168.20.83:3333/:path*',
      },
    ]
  },
}