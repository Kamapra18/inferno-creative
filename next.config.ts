import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  async redirects() {
    return [
      {
        source: '/portfolio',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/portofolio',
        destination: '/projects',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
