import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL ?? 'http://localhost:43101'}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
