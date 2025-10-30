/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    unoptimized: true 
  },
  compiler: { 
    styledComponents: true 
  },
  output: 'standalone',
  experimental: {
    swcMinify: true,
    optimizePackageImports: [
      'react-icons/fa',
      'framer-motion',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome',
    ]
  },
}

module.exports = nextConfig
