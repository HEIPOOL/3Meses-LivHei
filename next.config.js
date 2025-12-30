/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // DESLIGAR PARA THREE.JS
  images: {
    domains: ['i.ibb.co', 'images.unsplash.com'],
    unoptimized: true,
  },
  // Adicionar headers CORS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;