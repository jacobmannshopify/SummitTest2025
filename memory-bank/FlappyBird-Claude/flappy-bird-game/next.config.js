/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize images
  images: {
    unoptimized: true, // Since we're using canvas
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable static export for better performance
  output: 'export',
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress assets
  compress: true,
  
  // Generate source maps for production debugging
  productionBrowserSourceMaps: false,
  
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 