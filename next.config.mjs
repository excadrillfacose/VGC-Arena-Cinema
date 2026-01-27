/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* 
  // Temporarily disabled for Phase 2 (Visual Engine) to allow external CDN loading 
  // Will potentially re-enable with Service Worker Proxy or Credentialless in Phase 5
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  */
  async rewrites() {
    return [
      // FX Assets (Particles, Weather, Status)
      {
        source: '/:path*.png',
        destination: 'https://play.pokemonshowdown.com/fx/:path*.png',
      },
      {
        source: '/:path*.jpg',
        destination: 'https://play.pokemonshowdown.com/fx/:path*.jpg',
      },
      // Trainer Sprites fallback
      {
        source: '/sprites/trainers/:path*',
        destination: 'https://play.pokemonshowdown.com/sprites/trainers/:path*',
      }
    ];
  },
};

export default nextConfig;
