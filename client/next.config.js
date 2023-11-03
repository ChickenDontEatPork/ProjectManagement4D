/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'cdn1.iconfinder.com',
      'static.vecteezy.com',
      'storage-dev.bxdman.com',
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
