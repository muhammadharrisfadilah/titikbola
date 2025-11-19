/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Output for Cloudflare Pages
  output: 'export', // Static export
  
  // Image optimization (disable for static export)
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for better Cloudflare Pages routing
  trailingSlash: true,
  
  // Base path (if deploying to subdirectory)
  // basePath: '',
  
  // Asset prefix (for CDN)
  // assetPrefix: 'https://cdn.titikbola.com',
  
  // Headers for security & caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },
  
  // Webpack config (untuk optimize bundle)
  webpack: (config, { dev, isServer }) => {
    // Optimize production build
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      };
    }
    
    return config;
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://titikbola.pages.dev',
  },
  
  // Experimental features
  experimental: {
    // Enable if needed
    // optimizeCss: true,
  },
};

module.exports = nextConfig;