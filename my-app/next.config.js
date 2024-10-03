// my-app/next.config.js
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: 'http://localhost:3001/:path*', // Порт для админ-панели
      },
    ];
  },
};